const errorHandling = (err, req, res, next) => {
  let { message } = err;
  res.render("error", { message });
  next();
};

module.exports = errorHandling;
