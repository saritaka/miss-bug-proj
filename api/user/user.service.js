import fs from "fs";
import { utilService } from "../../Services/util.service.js";

// const PAGE_SIZE = 2;
const PAGE_SIZE = 20;
const users = utilService.readJsonFile("data/user.json");

export const userService = {
  query,
  getById,
  remove,
  save,
};

async function query() {
  return users;
}

async function getById(userId) {
  try {
    const user = users.find((user) => user._id === userId);
    return user;
  } catch (error) {
    throw error;
  }
}

async function remove(userId) {
  try {
    const userInd = users.findIndex((user) => user._id === userId);
    if (userInd < 0) throw `can't find user`;
    users.splice(userInd, 1);
    _saveUsersToFile();
  } catch (error) {
    throw error;
  }
}

async function save(userToSave) {
  try {
    if (userToSave._id) {
      const ind = users.findIndex((user) => user._id === userToSave._id);
      if (ind < 0) throw `can't find user ID ${userToSave._id}`;
      users[ind]._id = userToSave._id;
      users[ind].fullname = userToSave.fullname;
      users[ind].username = userToSave.username;
      users[ind].password = userToSave.password;
      users[ind].score = userToSave.score;
      // console.log("in user service user to save:", userToSave);
    } else {
      userToSave._id = utilService.makeId();
      users.push(userToSave);
    }
    _saveUsersToFile();
    return userToSave;
  } catch (error) {
    throw error;
  }
}

function _saveUsersToFile(path = "./data/user.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(users, null, 4);
    // const data = JSON.stringify(users);
    console.log("data:", data);
    fs.writeFile(path, data, (err) => {
      if (err) return reject();
      resolve();
    });
  });
}
