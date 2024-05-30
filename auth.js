const jwt = require("jsonwebtoken")
const jwtSecret = process.env.jwtSecret;
exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        console.log(decodedToken);
        return res.status(401).json({ message: "err" })
      }else{
        next();
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}