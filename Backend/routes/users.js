const express = require("express");
const passport = require("passport")
const jwt = require("jsonwebtoken")
const router = express.Router();
const User = require("../models/User.js");
const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser } = require("../authenticate")


const isValidIpAddress = (ip) => {
  const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

const isValidSubnetMask = (mask) => {
  // check if its a number between 0 and 32
  if (isNaN(mask) || mask < 0 || mask > 32) {
    return false;
  }
  return true;
};


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
            res.send({message: "Username already exists"});
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
        res.statusCode = 500;
        res.send({message: err});
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
        res.send({ user, success: true, token });
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
            res.send({message: "Unauthorized"})
          } else {
  
            const token = getToken({ _id: userId })
  
            const newRefreshToken = getRefreshToken({ _id: userId })
            user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken }
  
            await user.save()
  
            res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
            res.send({ user, success: true, token })
          }
  
        } else {
          res.statusCode = 401
          res.send({message: "Unauthorized"})
        }
  
      } catch (err) {
        res.statusCode = 401
        res.send({message: "Unauthorized"})
      }
  
    } else {
      res.statusCode = 401
      res.send({message: "Unauthorized"})
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
        return res.status(401).send({message: "Unauthorized"});
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
        return res.status(400).send({message: "Bad request - no password provided"});
      }
      
      if (req.body.currentPassword == req.body.newPassword) {
        return res.status(400).send({message: "Bad request - new password is the same as the old one"});
      }

      let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).send({message: "Bad request - password not complex enough (at least 8 characters, 1 number, 1 lowercase, 1 uppercase, 1 special character)"});
      }      

      const user = await User.findById(req.user._id);
      await user.changePassword(req.body.currentPassword, req.body.newPassword);
      res.send({ success: true });
    } catch (err) {
      next(err);
    }
  });

// Setup wizard on first login
router.post("/setup", verifyUser, async (req, res, next) => {
    /*
    Parameters:
    - username: username
    - currentPassword: current password
    - newPassword: new password
    - internal_ipRanges: array of internal ip ranges [{
        ip: ip address
        subnetMask: subnet mask
    }]
    - external_ipRanges: array of external ip ranges [{
        ip: ip address
        subnetMask: subnet mask
        gateway: gateway
        dns_server : dns server
    }]

    */
    try {
      let user = await User.findById(req.user._id);
      if (!user.firstLogin) {
        return res.status(401).send({ message: "User has been setup already" });
      }
  
  
      // Validate and save network settings
      const { internal_ipRanges, external_ipRanges } = req.body;
      if (!Array.isArray(internal_ipRanges) || !Array.isArray(external_ipRanges)) {
        return res.status(400).send({ message: "Bad request - invalid network settings" });
      }
  
      for (const network of [...internal_ipRanges, ...external_ipRanges]) {
        if (!isValidIpAddress(network.ip) || !isValidSubnetMask(network.subnetMask)) {
          return res.status(400).send({ message: "Bad request - invalid IP address or subnet mask" });
        }
      }
  
      // Save the network settings to the user object
      user.internalNetworks = internal_ipRanges;
      user.externalNetworks = external_ipRanges;
 
      // setting up new password make sure it's complex and not the same as the old one
      let newPassword = req.body.newPassword;
      if (!newPassword) {
        return res.status(400).send({message: "Bad request - no new password"});
      }
      // check complexity of password based on the following rules:
      // 1. At least 8 characters
      // 2. At least 1 number
      // 3. At least 1 lowercase letter
      // 4. At least 1 uppercase letter
      // 5. At least 1 special character


      let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).send({message: "Bad request - password not complex enough (at least 8 characters, 1 number, 1 lowercase, 1 uppercase, 1 special character)"});
      }


      // change username 
      let username = req.body.username;
      if (!username) {
        return res.status(400).send({message: "Bad request - no username"});
      }

      // check if username is already taken

      let usernameRegex = /^[a-zA-Z0-9]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).send({message: "Bad request - username can only contain alphanumeric characters"});
      }

      // check if username is already taken
      let check_username = await User.find({username: username});
      if (check_username.length > 0) {
        return res.status(400).send({message: "Bad request - username already taken"});
      }



      // check if valid password
      const isPasswordValid =  await user.changePassword(req.body.currentPassword, req.body.newPassword);
      if (!isPasswordValid) {
        return res.status(400).send({message: "Bad request - current password is incorrect"});
      }



      user.username = req.body.username;
      user.firstLogin = false;
      await user.save();
      res.send({ success: true });
    } catch (err) {
      next(err);
    }
});

  


module.exports = router;
