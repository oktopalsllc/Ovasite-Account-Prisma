const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  console.error(err);
  return err;
};

// not Found

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler

// const errorHandler = (err, req, res, next) => {
//   const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
//   res.status(statuscode);
//   res.json({
//     status: "fail",
//     message: err?.message,
//     stack: err?.stack,
//   });
// };

// Forbidden error
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = "ForbiddenError";
    this.status = 403;
  }
}

// Not found error
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

// Internal server error
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalServerError";
    this.status = 500;
  }
}

const errorHandler = (error, req, res, next) => {
  if (
    error instanceof ForbiddenError ||
    error instanceof NotFoundError ||
    error instanceof InternalServerError
  ) {
    console.error(error);
    res.status(error.status).json({ message: error.message });
  } else {
    console.error(error);
    res.status(500).json({ message: "An unknown error occurred" });
  }
};

export {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  createError,
  errorHandler,
  notFound,
};
