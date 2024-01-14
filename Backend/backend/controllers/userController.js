const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const generateToken = require("../config/generateToken");
const cloudinary = require("cloudinary").v2;

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;
  console.log("request", req.body);
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the values");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exist");
  }

  // if (picture) {
  //   cloudinary.uploader.upload(picture, async (err, result) => {
  //     if (err) {
  //       console.log("error", err);
  //       return res
  //         .status(500)
  //         .send({ message: "Something went wrong please try again later" });
  //     }

  //     const user = await User.create({
  //       name,
  //       email,
  //       password,
  //       picture: result.url,
  //     });

  //     if (user) {
  //       res.status(201).json({
  //         _id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         picture: user.picture,
  //         token: generateToken(user._id),
  //       });
  //       await unlinkFile(picture);
  //     } else {
  //       res.status(400);
  //       throw new Error("Failed to create the User");
  //     }
  //   });
  // } else {
  const user = await User.create({
    name,
    email,
    password,
    picture,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
  // }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password, "email password combination");

  if (!email || !password) {
    res.status(400);
    throw new Error("Please Enter all the values");
  }
  const userExist = await User.findOne({ email });
  if (userExist && (await userExist.matchPassword(password))) {
    res.status(200).json({
      _id: userExist.id,
      name: userExist.name,
      email: userExist.email,
      picture: userExist.picture,
      token: generateToken(userExist._id),
    });
  } else {
    res.status(404);
    throw new Error("Invalid email or password");
  }
});

const allUser = asyncHandler(async (req, res) => {
  const keyword = req.query?.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  console.log(keyword);
  res.send(users);
});

module.exports = { registerUser, authUser, allUser };
