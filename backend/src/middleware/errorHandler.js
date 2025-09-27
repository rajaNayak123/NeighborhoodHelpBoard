const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error(err.stack); // Log error stack for debugging

  res.json({
    message: err.message,
    // Provide stack trace only in development environment
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export{
    errorHandler
}