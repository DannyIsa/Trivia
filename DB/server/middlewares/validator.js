require("dotenv").config();
const jwt = require("jsonwebtoken");
const { RefreshTokens } = require("../../models");

function validator(req, res, next) {
  const refreshToken = req.header["refreshToken"].split(" ")[1];
  const accessToken = req.header["accessToken"].split(" ")[1];
  if (!accessToken || !refreshToken) return res.status(400).send("must have a valid token");
  //check accesstoken
  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (errAccess, userAccess) => {
      //access token not valid  
      if (errAccess) {
        ///check if refreshtoken is valid
        const tokenIsValid = await RefreshTokens.findOne({
          where: { refresh_token: refreshToken },
        });
        if (!tokenIsValid) return res.status(401).send("invalid refresh token");/////////login willbe require
        ///verify the refreshtoken 
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (errRefresh, userRefresh) => {
          if (errRefresh) return res.status(401).send("invalid refresh token");///////////////login willbe require
          //refresh token is good but access token is not
          const newAccessToken = jwt.sign(userRefresh, process.env.ACCESS_TOKEN_SECRET);
          return res.json({ accessToken: newAccessToken, refreshToken = refreshToken }).status(403);/////require to re-request
          // req.accessToken = newAccessToken;
          // req.refreshToken = refreshToken;
          // req.user = userRefresh;
        });
      }
      //access token is valid
      req.user = userAccess;
      req.accessToken = accessToken;
      req.refreshToken = refreshToken;
      return next(); // or outside
    }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);/////////////////////////////////////////////////////
  }
}

module.exports = { validator };
