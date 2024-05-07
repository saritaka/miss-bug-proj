import fs from "fs";
import { utilService } from "../../Services/util.service.js";

const PAGE_SIZE = 2;
const bugs = utilService.readJsonFile("data/bug.json");

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function query(filterBy = {}, sortBy = {}) {
  let filteredBugs = [...bugs];

  try {
    if (filterBy.txt) {
      console.log("filterby.txt", filterBy.txt);
      filteredBugs = filteredBugs.filter((bug) =>
        bug.title.toLowerCase().includes(filterBy.txt.toLowerCase())
      );
    }

    if (filterBy.severity) {
      filteredBugs = filteredBugs.filter(
        (bug) => bug.severity >= filterBy.severity
      );
    }

    if (sortBy.title) {
      filteredBugs.sort((a, b) => {
        const nameA = a.title.toUpperCase();
        const nameB = b.title.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }

    if (filterBy.pageIdx !== undefined) {
      const startIdx = filterBy.pageIdx * PAGE_SIZE;
      filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE);
    }

    // console.log("bugs", bugs);
    return filteredBugs;
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
