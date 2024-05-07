import { bugService } from "./bug.service.js";

export async function getBugs(req, res) {
  const { txt, severity, pageIdx } = req.query;
  const filterBy = { txt, severity: +severity, pageIdx };
  console.log(filterBy);
  try {
    const bugs = await bugService.query(filterBy);
    res.send(bugs);
  } catch (error) {
    loggerService.error(`couldn't get bug`, error);
    res.status(400).send(`Coudn't get bugs`);
  }
}

export async function getBug(req, res) {
  try {
    const id = req.params.bugId;
    const bug = await bugService.getById(id);
    let visitedCount = req.cookies.visitedCount || [];

    var add = true;
    for (var index = 0; index < visitedCount.length; ++index) {
      var _bug = visitedCount[index];
      if (_bug._id === id) {
        add = false;
      }
    }
    if (add) {
      visitedCount.push(bug);
    }
    res.cookie("visitedCount", visitedCount, {
      maxAge: 7 * 1000,
    });
    if (visitedCount.length > 3) {
      res.status(401).send("Wait for a bit");
    } else {
      res.send(bug);
    }
  } catch (error) {
    loggerService.error(`Couldn't get bug`, error);
    res.status(400).send(`Couldn't get bug`);
  }
}

export async function removeBug(req, res) {
  try {
    const id = req.params.bugId;
    await bugService.remove(id);
    res.send(`deleted bug ${id}`);
  } catch (error) {
    loggerService.error(`Couldn't delete bug`, error);
    res.status(400).send(`Couldn't delete bug`);
  }
}

export async function updateBug(req, res) {
  const { _id, title, severity, description } = req.body;
  let bugToSave = { _id, title, severity: +severity, description };
  try {
    bugToSave = await bugService.save(bugToSave);
    res.send(bugToSave);
  } catch (error) {
    loggerService.error(`Couldn't save car`, error);
    res.status(400).send(`Couldn't save car`);
  }
}

export async function addBug(req, res) {
  const { title, severity, description } = req.body;
  let bugToSave = { title, severity: +severity, description };
  try {
    bugToSave = await bugService.save(bugToSave);
    res.send(bugToSave);
  } catch (error) {
    loggerService.error(`Couldn't save car`, error);
    res.status(400).send(`Couldn't save car`);
  }
}
