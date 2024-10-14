const express = require("express");
const router = express.Router(); // ka matlab hai ke hum Express framework ka use kar ke ek naya router object bana rahe hain.
const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateToken = require("../middleware/validate-token");

//regestration
router.post("/register", async (req, resp) => {
  try {
    const userexist = await User.findOne({ email: req.body.email });
    if (userexist) {
      return resp.status(400).json({ message: "User Already Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;
    await User.create(req.body);
    return resp.status(201).json({ message: "User Register Successfully" });
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});

//user Login
router.post("/login", async (req, resp) => {
  try {
    //check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return resp.status(400).json({ message: "User Not Found" });
    }

    //check if password correct
    const validpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validpassword) {
      return resp.status(400).json({ message: "Invalid Password" });
    }

    //create and assign token
    const token = jwt.sign({ _id: user._id }, "shivevents-mern");

    return resp.status(200).json({ token, message: "Login Successful" });
  } catch (error) {
    resp.status(500).json({ message: error.message });
  }
});

//get current user
router.get("/current-user", validateToken, async (req, resp) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); //password nahi chhaye ess liye - laggya hai

    return resp.status(200).json({ data: user });
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});

router.get("/get-all-users", validateToken, async (req, resp) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return resp
      .status(200)
      .json({ data: users, message: "User Fetch Successfully" });
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});

router.put("/update-user", validateToken, async (req, resp) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, req.body);
    return resp.status(200).json({ message: "User Updated Successfully" });
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});
module.exports = router;
