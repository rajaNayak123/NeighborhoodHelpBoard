const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Log error details for debugging
  console.error("🚨 Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle specific error types
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    return res.json({
      success: false,
      message: `Validation Error: ${message}`,
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  }

  if (err.name === "CastError") {
    return res.json({
      success: false,
      message: "Invalid ID format",
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  }

  if (err.code === 11000) {
    return res.json({
      success: false,
      message: "Duplicate field value entered",
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  }

  res.json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export { errorHandler };
