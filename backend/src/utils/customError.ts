export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflito de dados") {
    super(message, 409);
  }
}

export class UnathourizedError extends AppError {
  constructor(message: string = "Não autorizado") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso não encontrado") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Dados inválidos") {
    super(message, 400);
  }
}