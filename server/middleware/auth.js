const isLogin = async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.redirect("/");
    }
    next();
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/index");
    }
    next();
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

module.exports = {
  isLogin,
  isLogout,
};
