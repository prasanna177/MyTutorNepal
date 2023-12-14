const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
  try {
    const token = req.headers['authorization'].split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if(err) {
        return res.status(401).send({
          message: "Auth failed",
          success: false
        })
      } else {
        req.body.userId = decodedToken.id;
        next();
      }
    })
  } 
  catch(error) {
    console.log(error);
    res.status(401).send({
      message: "Auth failed",
      status: false
    })
  }
}