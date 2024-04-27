import mongoose from "mongoose";
import userModel from "../models/user.js";

mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getUsers(name, job) {
  const query = {};

  if (name !== undefined) {
    query.name = name;
  }

  if (job !== undefined) {
    query.job = job;
  }

  return userModel.find(query);
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

const deleteUser = (id) => {
  return userModel
    .findByIdAndDelete(id)
    .then((deletedUser) => {
      if (deletedUser) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error(error);
      throw new Error("An error occurred while deleting the user.");
    });
};

export default {
  addUser,
  getUsers,
  findUserById,
  deleteUser,
};