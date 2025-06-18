import { Types } from "mongoose";
import {
  createReview,
  getReviewsByMovie,
  updateReview,
  deleteReview,
} from "../../src/services/reviewService";
import { Review } from "../../src/models/Review";
import { BadRequestError, NotFoundError } from "../../src/utils/customError";

jest.mock("../../src/models/Review");

describe("reviewService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createReview", () => {

    it("Deve criar nova review quando dados válidos", async () => {
      (Review.findOne as jest.Mock).mockResolvedValue(null);

      const fakeReview = {
        movieId: 123,
        author: "u1",
        rating: 5,
        content: "ótimo",
        save: jest.fn().mockResolvedValue("saved")
      };
      (Review as any).mockImplementation(() => fakeReview);

      const result = await createReview(123, "u1", 5, "ótimo");

      expect(Review.findOne).toHaveBeenCalledWith({
        movieId: 123,
        author: "u1",
      });
      expect(fakeReview.save).toHaveBeenCalled();
    });

    it("Deve lançar Error se movieId for inválido", async () => {
      await expect(createReview(0, "u1", 4, "ok")).rejects.toBeInstanceOf(
        BadRequestError
      )
    });

    it("Deve lançar Error se review já existe", async () => {
      (Review.findOne as jest.Mock).mockResolvedValue({} as any);

      await expect(createReview(123, "u1", 3, "bom")).rejects.toThrow(
        "Você já avaliou este filme"
      );
      expect(Review.findOne).toHaveBeenCalledWith({
        movieId: 123,
        author: "u1",
      });
    });
  });

  describe("getReviewsByMovie", () => {
    it("Deve retornar array de reviews quando movieId válido", async () => {
      const fakeArray = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];

      const sortMock = { populate: jest.fn().mockResolvedValue(fakeArray) };
      (Review.find as jest.Mock).mockReturnValue({ sort: () => sortMock } as any);

      const response = await getReviewsByMovie(43);

      expect(Review.find).toHaveBeenCalledWith({ movieId: 43 });
      expect(sortMock.populate).toHaveBeenCalledWith("author", "name");
      expect(response).toBe(fakeArray);
    });

    it("Deve lançar Error se movieId inválido", async () => {
      await expect(getReviewsByMovie(-1)).rejects.toBeInstanceOf(
        BadRequestError
      );
    });
  });

  describe("updateReview", () => {
    const reviewId = new Types.ObjectId().toHexString();

    it("Deve atualizar apenas rating quando content undefined", async () => {
      const updated = {
        _id: reviewId,
        rating: 4
      };
      (Review.findOneAndUpdate as jest.Mock).mockResolvedValue(updated);

      const response = await updateReview(reviewId, updated);

      expect(Review.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: reviewId },
        { $set: { rating: 4 } },
        { new: true, runValidators: true }
      );
      expect(response).toBe(updated);
    });

    it("Deve atualizar apenas content quando rating undefined", async () => {
      const updated = {
        _id: reviewId,
        content: "novoContent"
      };
      (Review.findOneAndUpdate as jest.Mock).mockResolvedValue(updated);

      const response = await updateReview(reviewId, updated);

      expect(Review.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: reviewId },
        { $set: { content: "novoContent" } },
        { new: true, runValidators: true }
      );
      expect(response).toBe(updated);
    });

    it("Deve lançar Error se não encontrar a review", async () => {
      (Review.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        updateReview(reviewId, { rating: 4 })
      ).rejects.toBeInstanceOf(NotFoundError);
      expect(Review.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: reviewId },
        { $set: { rating: 4 } },
        { new: true, runValidators: true }
      );
    });
  });

  describe("deleteReview", () => {
    it("Deve chamar deleteOne quando a review existir", async () => {
      const fakeDoc = { deleteOne: jest.fn().mockResolvedValue(undefined) };
      (Review.findById as jest.Mock).mockResolvedValue(fakeDoc);

      await deleteReview("id2");
      expect(fakeDoc.deleteOne).toHaveBeenCalled();
    });

    it("Deve lançar error se a review não existir", async () => {
      (Review.findById as jest.Mock).mockResolvedValue(null);

      await expect(deleteReview("id1")).rejects.toBeInstanceOf(
        NotFoundError
      );
      expect(Review.findById).toHaveBeenCalledWith("id1");
    });
  });
});