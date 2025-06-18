import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app";
import * as reviewService from "../../src/services/reviewService";

jest.mock("../../src/services/reviewService");

jest.mock("../../src/middlewares/authMiddleware", () => ({
  protect: (_req: any, _res: any, next: any) => {
    _req.user = { id: "user1", name: "User One", role: "user" };
    next();
  },
}));

jest.mock("../../src/middlewares/validateParams", () => ({
  validateParams: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock("../../src/middlewares/ownReview", () => ({
  ownReview: (_req: any, _res: any, next: any) => next(),
}));

jest.mock("../../src/middlewares/validateRequest", () => ({
  validateRequest: () => (_req: any, _res: any, next: any) => next(),
}));

describe("Integração: reviewController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("POST /api/v1/:movieId/reviews", () => {
    it("Deve retornar status 201 e criar review", async () => {
      const fake = {
        _id: "r1",
        movieId: 10,
        author: "user1",
        rating: 4,
        content: "Ótimo filme!",
      };
      (reviewService.createReview as jest.Mock).mockResolvedValue(fake);

      const res = await request(app)
        .post("/api/v1/10/reviews")
        .set("Content-Type", "application/json")
        .send({ rating: 4, content: "Ótimo filme!" });

      expect(reviewService.createReview).toHaveBeenCalledWith(10, "user1", 4, "Ótimo filme!");
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ success: true, review: fake });
    });

    it("Deve retornar status 500 e Error", async () => {
      (reviewService.createReview as jest.Mock).mockRejectedValue(new Error("fail-create"));

      const res = await request(app)
        .post("/api/v1/10/reviews")
        .set("Content-Type", "application/json")
        .send({ rating: 2, content: "ok" });

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ success: false });
    });
  });

  describe("GET /api/v1/:movieId/reviews", () => {
    it("Deve retornar status 200 e listar reviews", async () => {
      const fakeArr = [
        { _id: "r1", movieId: 10, author: { name: "Alice" }, rating: 5, content: "Ótimo" },
        { _id: "r2", movieId: 10, author: { name: "Bob" }, rating: 3, content: "Bom" },
      ];
      (reviewService.getReviewsByMovie as jest.Mock).mockResolvedValue(fakeArr);

      const res = await request(app)
        .get("/api/v1/10/reviews")
        .set("Content-Type", "application/json");

      expect(reviewService.getReviewsByMovie).toHaveBeenCalledWith(10);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, reviews: fakeArr });
    });

    it("Deve retornar status 500 e Error", async () => {
      (reviewService.getReviewsByMovie as jest.Mock).mockRejectedValue(new Error("fail-get"));

      const res = await request(app)
        .get("/api/v1/10/reviews")
        .set("Content-Type", "application/json");

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ success: false });
    });
  });

  describe("PATCH /api/v1/reviews/:id", () => {
    it("Deve retornar status 200 e atualizar review", async () => {
      const updated = {
        _id: "r1",
        movieId: 10,
        author: "user1",
        rating: 2,
        content: "Atualizado",
      };
      (reviewService.updateReview as jest.Mock).mockResolvedValue(updated);

      const res = await request(app)
        .patch("/api/v1/reviews/r1")
        .set("Content-Type", "application/json")
        .send({ rating: 2, content: "Atualizado" });

      expect(reviewService.updateReview).toHaveBeenCalledWith("r1", { rating: 2, content: "Atualizado" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, review: updated });
    });

    it("Deve retornar status 500 e Error", async () => {
      (reviewService.updateReview as jest.Mock).mockRejectedValue(new Error("fail-update"));

      const res = await request(app)
        .patch("/api/v1/reviews/r1")
        .set("Content-Type", "application/json")
        .send({ content: "x" });

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ success: false });
    });
  });

  describe("DELETE /api/v1/reviews/:id", () => {
    it("Deve retornar status 200 e deletar review", async () => {
      (reviewService.deleteReview as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .delete("/api/v1/reviews/r1")
        .set("Content-Type", "application/json");

      expect(reviewService.deleteReview).toHaveBeenCalledWith("r1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, message: "Review excluído" });
    });

    it("Deve retornar status 500 e Error", async () => {
      (reviewService.deleteReview as jest.Mock).mockRejectedValue(new Error("fail-delete"));

      const res = await request(app)
        .delete("/api/v1/reviews/r1")
        .set("Content-Type", "application/json");

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ success: false });
    });
  });
});
