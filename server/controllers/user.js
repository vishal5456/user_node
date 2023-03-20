import User from "../models/users.js";
import path from "path";
import { unlink } from 'node:fs/promises';
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res.status(404).send("Bad Request!!Please Send userId to update");

    const foundUser = await User.findOne({ userId }).select("-_id -__v").lean();
    const picName = `${foundUser.email}_${foundUser.profileImage}`
    let profilePicPath = `http://localhost:4540/images/${picName}`;
    foundUser.profilePicPath = profilePicPath
    if (!foundUser)
      return res.status(400).send({ code: 400, message: "No user found!!!" });
    return res.status(200).send({
      message: "User Found",
      user: foundUser,
    });
  } catch (error) {
    return res.status(500).json(error.stack);
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res
        .status(404)
        .send("Bad Request!!Please Send userId to delete user");

    const deletedUser = await User.findOneAndDelete({ userId }, { new: true })
      .select("-_id -__v")
      .lean();
    if (!deletedUser)
      return res
        .status(501)
        .send({ code: 400, message: "User doesn't exists!!!" });
    return res.status(200).send({
      message: "User Successfully deleted",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-_id -__v").lean();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile } = req.body;
    const { profileImage } = req.files;
    const { name: fileName } = profileImage;

    if (!firstName || !lastName || !email || !mobile)
      return res
        .status(400)
        .send({ code: 400, message: "Mandatory field Missing" });

    const foundUser = await User.findOne({ email });

    if (foundUser)
      return res
        .status(400)
        .send({ code: 400, message: "User Already Exists!!!" });

    const filePath = path.join(
      __dirname,
      "../../uploads/images",
      `${email}_${fileName}`
    );

    profileImage.mv(filePath, (err) => {
      console.log(err);
      if (err)
        return res
          .status(500)
          .send({ code: 500, message: "Internal server error" });
    });

    const user = await User({
      firstName,
      lastName,
      email,
      mobile,
      profileImage: fileName,
    }).save();

    if (!user) return res.status(501).send("Something went wrong");
    return res.status(201).send({
      message: "User Successfully created",
      user: {
        userId: user.userId,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email:emailId } = req.body;
    if (!userId)
      return res
        .status(404)
        .send({
          code: 400,
          message: "Bad Request!!Please Send userId to update",
        });

        const foundUser = await User.findOne({userId}).select("-_id -__v").lean();
        
        if(emailId !== foundUser.email){
          const foundUser = await User.findOne({emailId}).select("-_id -__v").lean();
          if(foundUser) return res.status(400).send({code:400, message:"Email is alredy registerd! Please try with different one"})
        }


    if(!foundUser) return res.send({code :404 , message:"User doesnot exists!!!"} );

    const  {email , profileImage:imageName} = foundUser;

    let updateBody = {};
    Object.keys(req.body).forEach((key)=>{
        updateBody[key] = req.body[key]
    })

   

   
    if(req.files){
      const { profileImage } = req.files;
      const { name: fileName , size } = profileImage;
    if (fileName) {
      const allowedExt = ["jpg", "jpeg", "png"];
      const limit = 5 * 1024 * 1024;
      const ext = fileName.split(".")[1];
      if (!allowedExt.includes(ext))
        return res
          .status(400)
          .send({
            code: 400,
            message: "Please uplaod a .jpeg , .jpg , .png file",
          });

      if (size > limit)
        return res
          .status(400)
          .send({ code: 400, message: "Please upload image less than 5mb" });
          
          const previousFilePath = path.join(__dirname,'../../uploads/images',`${email}_${imageName}`);
          try{
            await unlink(previousFilePath);
          }catch(error){
            return res
            .status(500)
            .send({ code: 500, message: "Internal server error" });
          }

          const filePath = path.join(
            __dirname,
            "../../uploads/images",
            `${email}_${fileName}`
          );

          profileImage.mv(filePath, (err) => {
            console.log(err);
            if (err)
              return res
                .status(500)
                .send({ code: 500, message: "Internal server error" });
          });
          updateBody['profileImage'] = fileName
    }
  }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { ...updateBody },
      { new: true }
    )
      .select("-_id -__v")
      .lean();
    if (!updatedUser)
      return res
        .status(501)
        .send({ code: 400, message: "User doesn't exists!!!" });
        
    return res.status(200).send({
      message: "User Successfully updated",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.stack);
  }
};
