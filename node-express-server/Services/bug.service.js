import fs from "fs";
import { utilService } from "./util.service.js";

const bugs = utilService.readJsonFile("data/bug.json");

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function query() {
  try {
    return bugs;
  } catch (error) {
    throw error;
  }
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    return bug;
  } catch (error) {
    throw error;
  }
}

async function remove(bugId) {
  try {
    const bugInd = bugs.findIndex((bug) => bug._id === bugId);
    if (bugInd < 0) throw `can't find bug`;
    bugs.splice(bugInd, 1);
    _saveBugsToFile();
  } catch (error) {
    throw error;
  }
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const ind = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (ind < 0) throw `can't find bug ID${bugToSave._id}`;
      bugs[ind]._id = bugToSave._id;
      bugs[ind].title = bugToSave.title;
      bugs[ind].severity = bugToSave.severity;
      bugs[ind].description = bugToSave.description;
    } else {
      console.log("in else:", bugToSave);
      bugToSave._id = utilService.makeId();
      // console.log("the created id:", bugToSave._id);
      bugToSave.createdAt = +new Date();
      bugs.push(bugToSave);
    }
    _saveBugsToFile();
    return bugToSave;
  } catch (error) {
    throw error;
  }
}

function _saveBugsToFile(path = "./data/bug.json") {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 2);
    // const data = JSON.stringify(bugs);
    console.log("data:", data);
    fs.writeFile(path, data, (err) => {
      if (err) return reject();
      resolve();
    });
  });
}
