const express = require("express");
const passport = require("passport")
const jwt = require("jsonwebtoken")
const router = express.Router();
const User = require("../models/User.js");
const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require("../authenticate")

router.post("/signup", async (req, res, next) => {
    // check if username and password are provided
    if (!req.body.username || !req.body.password) {
        res.statusCode = 400;
        res.send("Username and password required");
        return;
    }
    
    // check if username already exists
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            res.statusCode = 403;
            res.send("Username already exists");
            return;
        }

        // create the new user
        const newUser = new User({ username: req.body.username });
        await newUser.setPassword(req.body.password);

        // generate tokens and save the refresh token to the user
        const token = getToken({ _id: newUser._id });
        const refreshToken = getRefreshToken({ _id: newUser._id });
        newUser.refreshToken.push({ refreshToken });
        await newUser.save();

        // send the response with the token and refresh token cookie
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.send({ success: true, token });
    } catch (err) {
        console.log(err)
        res.statusCode = 500;
        res.send(err);
    }
});


router.post("/login", passport.authenticate("local"), async (req, res, next) => {
    try {
        const token = getToken({ _id: req.user._id });
        const refreshToken = getRefreshToken({ _id: req.user._id });
        const user = await User.findById(req.user._id);
        user.refreshToken.push({ refreshToken });
        await user.save();
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.send({ success: true, token });
    } catch (err) {
        next(err);
    }
});

router.post("/refreshToken", async (req, res, next) => {

    const { signedCookies = {} } = req
    const { refreshToken } = signedCookies
  
    if (refreshToken) {
  
      try {
  
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const userId = payload._id
  
        const user = await User.findOne({ _id: userId })
  
        if (user) {
  
          const tokenIndex = user.refreshToken.findIndex(
            item => item.refreshToken === refreshToken
          )
  
          if (tokenIndex === -1) {
            res.statusCode = 401
            res.send("Unauthorized")
          } else {
  
            const token = getToken({ _id: userId })
  
            const newRefreshToken = getRefreshToken({ _id: userId })
            user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
  
            await user.save()
  
            res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
            res.send({ success: true, token })
          }
  
        } else {
          res.statusCode = 401
          res.send("Unauthorized")
        }
  
      } catch (err) {
        res.statusCode = 401
        res.send("Unauthorized")
      }
  
    } else {
      res.statusCode = 401
      res.send("Unauthorized")
    }
  
  })

router.get("/me", verifyUser, async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).then(user => {
        res.send(user);
      }
    );

    } catch (err) {
      next(err);
    }
});
  
router.get("/logout", verifyUser, async (req, res, next) => {
    try {
      const { signedCookies = {} } = req;
      const { refreshToken } = signedCookies;
  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(401).send("Unauthorized");
      }
  
      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken
      );
      if (tokenIndex !== -1) {
        user.refreshToken.splice(tokenIndex, 1);
        await user.save();
      }
  
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      res.send({ success: true });
    } catch (err) {
      next(err);
    }
  });
  
router.post("/changePassword", verifyUser, async (req, res, next) => {
    try {
      if (!req.body.currentPassword || !req.body.newPassword) {
        return res.status(400).send("Bad request");
      }  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(401).send("Unauthorized");
      }
      await user.changePassword(req.body.currentPassword, req.body.newPassword);
      res.send({ success: true });
    } catch (err) {
      next(err);
    }
  });
  
  


module.exports = router;
