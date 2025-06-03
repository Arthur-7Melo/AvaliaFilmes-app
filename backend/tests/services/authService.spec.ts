import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { createUser, forgotPassword, login, resetPassword } from "../../src/services/authService";
import { User } from "../../src/models/User";
import { BadRequestError, ConflictError, NotFoundError } from "../../src/utils/customError";
import { sendEmailResetPassword } from "../../src/services/emailService";

jest.mock("../../src/models/User");
jest.mock("../../src/services/emailService");

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  describe("createUser", () => {
    it("Deve criar usuário quando email não existir no banco de dados", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const fakeUserDoc = {
        _id: "d07g097sfh4098t9430th",
        name: "Teste",
        email: "teste@example.com",
        password: "passwordhashed",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (User.create as jest.Mock).mockResolvedValue(fakeUserDoc);

      const result = await createUser("Teste", "teste@example.com", "passwordhashed");

      expect(bcrypt.hash).toBeDefined();
      expect(User.findOne).toHaveBeenCalledWith({ email: "teste@example.com" });
      expect(User.create).toHaveBeenCalledWith({
        name: "Teste",
        email: "teste@example.com",
        password: expect.any(String),
      });
      expect(result).toEqual({
        id: fakeUserDoc._id.toString(),
        name: fakeUserDoc.name,
        email: fakeUserDoc.email,
        role: fakeUserDoc.role,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("Deve lançar Error caso o usuário já exista", async () => {
      const existing = {
        name: "Teste",
        email: "teste@example.com",
        password: "passwordhashed",
      };
      (User.findOne as jest.Mock).mockResolvedValue(existing);

      await expect(
        createUser("Teste", "teste@example.com", "outraSenha")
      ).rejects.toBeInstanceOf(ConflictError);
      expect(User.findOne).toHaveBeenCalledWith({ email: "teste@example.com" });
    });
  });

  describe("login", () => {
    it("Deve retornar token se credenciais corretas", async () => {
      const clientPassword = "senha123";
      const hashedPassword = await bcrypt.hash(clientPassword, 10);

      const fakeUser = {
        _id: "d07g097sfh4098t9430th",
        name: "Teste",
        email: "teste@example.com",
        password: hashedPassword,
      };
      (User.findOne as jest.Mock).mockResolvedValue(fakeUser);

      const signSpy = jest.spyOn(jwt, "sign") as unknown as jest.Mock;
      signSpy.mockReturnValue("tokenFake");
      const token = await login("teste@example.com", clientPassword);

      expect(User.findOne).toHaveBeenCalledWith({ email: "teste@example.com" });
      expect(token).toBe("tokenFake");
    });

    it("Deve retornar Error se o usuário não for encontrado", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      expect(
        login("teste@example.com", "passtest")
      ).rejects.toBeInstanceOf(NotFoundError);
      expect(User.findOne).toHaveBeenCalledWith({ email: "teste@example.com" });
    });

    it("Deve retornar Error se a senha estiver incorreta", async () => {
      const fakeUser = {
        _id: "d07g097sfh4098t9430th",
        name: "Teste",
        email: "teste@example.com",
        password: "senhaCorreta",
      };
      (User.findOne as jest.Mock).mockResolvedValue(fakeUser);

      expect(
        login("teste@example.com", "senhaIncorreta")
      ).rejects.toBeInstanceOf(BadRequestError)
      expect(User.findOne).toHaveBeenCalledWith({ email: "teste@example.com" });
    });
  });

  describe("forgotPassword", () => {
    it("Deve gerar token e enviar email se usuário existir", async () => {
      const mockUser = {
        email: "teste@teste.com",
        save: jest.fn(),
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await forgotPassword("teste@teste.com");
      const tokenSent = (sendEmailResetPassword as jest.Mock).mock.calls[0][1];

      expect(User.findOne).toHaveBeenCalledWith({ email: "teste@teste.com" });
      expect(mockUser.resetPasswordToken).toBeDefined();
      expect(mockUser.resetPasswordExpires).toBeInstanceOf(Date);
      expect(mockUser.save).toHaveBeenCalled();
      expect(sendEmailResetPassword).toHaveBeenCalledWith("teste@teste.com", tokenSent);
      expect(tokenSent).toHaveLength(64);
    });

    it("Deve lançar Error se o usuário não existir", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        forgotPassword("teste@teste.com")
      ).rejects.toBeInstanceOf(NotFoundError);
      expect(User.findOne).toHaveBeenCalledWith({ email: "teste@teste.com" });
      expect(sendEmailResetPassword).not.toHaveBeenCalled();
    });
  });

  describe("resetPassword", () => {
    it("Deve atualizar senha, limpar token e chamar save() quando token válido", async () => {
      const token = "meuToken"
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const fakeUser = {
        _id: "507f191e810c19729de860ea",
        email: "usuario@exemplo.com",
        password: "oldHashedPassword",
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 10000),
        save: jest.fn().mockResolvedValue(undefined),
      };

      (User.findOne as jest.Mock).mockResolvedValue(fakeUser);
      (jest.spyOn(bcrypt, "hash") as unknown as jest.Mock).mockResolvedValue("newFakeHash");

      await resetPassword(token, "newPassword");

      expect(bcrypt.hash).toHaveBeenCalledWith("newPassword", 10);
      expect(fakeUser.password).toBe("newFakeHash");
      expect(fakeUser.resetPasswordToken).toBeUndefined();
      expect(fakeUser.resetPasswordExpires).toBeUndefined();
      expect(fakeUser.save).toHaveBeenCalled();
    });

    it("Deve lançar Error se não houver usuário com token válido", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        resetPassword("tokenInvalido", "novasenha")
      ).rejects.toBeInstanceOf(BadRequestError);

      const expectedHashedToken = crypto.createHash("sha256").update("tokenInvalido").digest("hex");
      expect(User.findOne).toHaveBeenCalledWith({
        resetPasswordToken: expectedHashedToken,
        resetPasswordExpires: { $gt: expect.any(Date) }
      });
    });
  });
});