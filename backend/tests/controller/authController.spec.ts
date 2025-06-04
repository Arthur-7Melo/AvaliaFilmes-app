import request from 'supertest';
import app from '../../src/app';
import * as authService from "../../src/services/authService";
import { BadRequestError, ConflictError, NotFoundError } from '../../src/utils/customError';

jest.mock("../../src/services/authService");

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  describe("POST /api/auth/signup", () => {
    it("Deve retornar status 201 e { success: true, user }", async () => {
      const fakeUser = {
        id: "fjpoghjpr09535",
        name: "teste",
        email: "teste@teste.com",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (authService.createUser as jest.Mock).mockResolvedValue(fakeUser);

      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "teste",
          email: "teste@teste.com",
          password: "teste123"
        });

      expect(authService.createUser).toHaveBeenCalledWith(
        "teste",
        "teste@teste.com",
        "teste123"
      )
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        user: fakeUser
      });
    });

    it("Deve retornar status 409 e Error", async () => {
      (authService.createUser as jest.Mock).mockRejectedValue(
        new ConflictError("Usuário já possui cadastro")
      );

      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "Maria",
          email: "maria@teste.com",
          password: "teste123"
        });

      expect(authService.createUser).toHaveBeenCalledWith(
        "Maria",
        "maria@teste.com",
        "teste123"
      )
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        success: false,
        message: "Usuário já possui cadastro"
      });
    });

    it("Deve retornar status 500 e Error", async () => {
      (authService.createUser as jest.Mock).mockRejectedValue(
        new Error("Erro ao criar user")
      );

      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          name: "John",
          email: "john@teste.com",
          password: "teste123"
        });

      expect(authService.createUser).toHaveBeenCalledWith(
        "John",
        "john@teste.com",
        "teste123"
      )
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Erro ao criar user"
      });
    });
  });

  describe("POST /api/auth/signin", () => {
    it("Deve retornar status 200 e { success: true, token }", async () => {
      (authService.login as jest.Mock).mockResolvedValue("fakeToken");

      const response = await request(app)
        .post("/api/auth/signin")
        .send({
          email: "mary@teste.com",
          password: "marymary"
        });

      expect(authService.login).toHaveBeenCalledWith(
        "mary@teste.com",
        "marymary"
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        token: "fakeToken"
      });
    });

    it("Deve retornar status 404 e Error", async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new NotFoundError("Usuário não encontrado")
      );

      const response = await request(app)
        .post("/api/auth/signin")
        .send({
          email: "maria@example.com",
          password: "teste123"
        });

      expect(authService.login).toHaveBeenCalledWith(
        "maria@example.com",
        "teste123"
      )
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Usuário não encontrado"
      });
    });

    it("Deve retornar status 400 e Error", async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new BadRequestError("Senha incorreta")
      );

      const response = await request(app)
        .post("/api/auth/signin")
        .send({
          email: "leonardo@example.com",
          password: "senhaincorreta"
        });

      expect(authService.login).toHaveBeenCalledWith(
        "leonardo@example.com",
        "senhaincorreta"
      )
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: "Senha incorreta"
      });
    });

    it("Deve retornar status 500 e Error", async () => {
      (authService.login as jest.Mock).mockRejectedValue(
        new Error("Erro interno do servidor")
      );

      const response = await request(app)
        .post("/api/auth/signin")
        .send({
          email: "leonardo@example.com",
          password: "leonardo123"
        });

      expect(authService.login).toHaveBeenCalledWith(
        "leonardo@example.com",
        "leonardo123"
      )
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Erro interno do servidor"
      });
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("Deve retornar status 200 e mensagem de sucesso", async () => {
      (authService.forgotPassword as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({
          email: "joao@test.com"
        });

      expect(authService.forgotPassword).toHaveBeenCalledWith(
        "joao@test.com"
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Email enviado com sucesso"
      });
    });

    it("Deve retornar status 404 e Error", async () => {
      (authService.forgotPassword as jest.Mock).mockRejectedValue(
        new NotFoundError("Usuário não encontrado")
      );

      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({
          email: "maria@example.com"
        });

      expect(authService.forgotPassword).toHaveBeenCalledWith(
        "maria@example.com"
      )
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        message: "Usuário não encontrado"
      });
    });

    it("Deve retornar status 500 e Error", async () => {
      (authService.forgotPassword as jest.Mock).mockRejectedValue(
        new Error("Erro interno do servidor")
      );

      const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({
          email: "maria@example.com"
        });

      expect(authService.forgotPassword).toHaveBeenCalledWith(
        "maria@example.com"
      )
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Erro interno do servidor"
      });
    });
  });

  describe("POST /api/auth/reset-password/:token", () => {
    it("Deve retornar status 200 e mensagem de sucesso", async () => {
      (authService.resetPassword as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .post("/api/auth/reset-password/tokenValido")
        .send({
          password: "novasenha"
        });

      expect(authService.resetPassword).toHaveBeenCalledWith(
        "tokenValido",
        "novasenha"
      )
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Senha alterada com sucesso"
      });
    });

    it("Deve retornar status 400 e Error", async () => {
      (authService.resetPassword as jest.Mock).mockRejectedValue(
        new BadRequestError("Token inválido")
      );

      const response = await request(app)
        .post("/api/auth/reset-password/tokenInvalido")
        .send({
          password: "newpassword"
        });

      expect(authService.resetPassword).toHaveBeenCalledWith(
        "tokenInvalido",
        "newpassword"
      )
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        message: "Token inválido"
      });
    });

    it("Deve retornar status 500 e Error", async () => {
      (authService.resetPassword as jest.Mock).mockRejectedValue(
        new Error("Erro interno do servidor")
      );

      const response = await request(app)
        .post("/api/auth/reset-password/tokenqualquer")
        .send({
          password: "qualquersenha"
        });

      expect(authService.resetPassword).toHaveBeenCalledWith(
        "tokenqualquer",
        "qualquersenha"
      )
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        success: false,
        message: "Erro interno do servidor"
      });
    });
  });
});