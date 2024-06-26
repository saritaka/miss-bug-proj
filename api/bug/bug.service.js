import fs from "fs";
import { utilService } from "../../Services/util.service.js";

// const PAGE_SIZE = 2;
const PAGE_SIZE = 20;
const bugs = utilService.readJsonFile("data/bug.json");

export const bugService = {
  query,
  getById,
  remove,
  save,
};

async function query(filterBy = {}) {
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

    if (filterBy.label) {
      console.log("filterby.label", filterBy.label);
      filteredBugs = filteredBugs.filter((bug) =>
        bug.labels.includes(filterBy.label)
      );
    }

    if (filterBy.sortBy) {
      if (filterBy.sortBy === "title") {
        filteredBugs.sort((a, b) => a.title.localeCompare(b.title));
      }
      if (filterBy.sortBy === "severity") {
        filteredBugs.sort((a, b) => a.severity - b.severity);
      }
      if (filterBy.sortBy === "createdAt") {
        if (filterBy.sortDir === -1) {
          filteredBugs.sort((a, b) => b.createdAt - a.createdAt);
        } else {
          filteredBugs.sort((a, b) => a.createdAt - b.createdAt);
        }
      }
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
      if (ind < 0) throw `can't find bug ID ${bugToSave._id}`;
      bugs[ind]._id = bugToSave._id;
      bugs[ind].title = bugToSave.title;
      bugs[ind].severity = bugToSave.severity;
      bugs[ind].description = bugToSave.description;
      bugs[ind].labels = bugToSave.labels;
    } else {
      console.log("in else:", bugToSave);
      bugToSave._id = utilService.makeId();
      // console.log("the created id:", bugToSave._id);
      bugToSave.createdAt = +new Date();
      bugToSave.labels = [];
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
    const data = JSON.stringify(bugs, null, 4);
    // const data = JSON.stringify(bugs);
    console.log("data:", data);
    fs.writeFile(path, data, (err) => {
      if (err) return reject();
      resolve();
    });
  });
}
