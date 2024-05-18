import { userService } from "./user.service.js";
import { loggerService } from "../../Services/logger.service.js";

export async function getUsers(req, res) {
  try {
    const users = await userService.query();
    res.send(users);
  } catch (error) {
    loggerService.error(`couldn't get user`, error);
    res.status(400).send(`Coudn't get users`);
  }
}

export async function getUser(req, res) {
  try {
    const { bugId } = req.params;
    let visitedCount = req.cookies.visitedCount || [];

    if (visitedCount.length > 2) {
      res.status(401).send("Wait for a bit");
    }
    if (!visitedCount.includes(bugId)) visitedCount.push(bugId);
    res.cookie("visitedCount", visitedCount, {
      maxAge: 7 * 1000,
    });

    res.send(user);
  } catch (error) {
    loggerService.error(`Couldn't get user`, error);
    res.status(400).send(`Couldn't get user`);
  }
}

export async function removeUser(req, res) {
  try {
    const id = req.params.userId;
    await userService.remove(id);
    res.send(`deleted user ${id}`);
  } catch (error) {
    loggerService.error(`Couldn't delete user`, error);
    res.status(400).send(`Couldn't delete user`);
  }
}

export async function updateUser(req, res) {
  const { _id, fullname, score, username, password } = req.body;
  let userToSave = { _id, fullname, score: +score, username, password };
  try {
    userToSave = await userService.save(userToSave);
    res.send(userToSave);
  } catch (error) {
    loggerService.error(`Couldn't save user`, error);
    res.status(400).send(`Couldn't save user`);
  }
}

export async function addUser(req, res) {
  const { fullname, username, score, password } = req.body;
  let userToSave = { fullname, score: +score, username, password };
  try {
    userToSave = await userService.save(userToSave);
    res.send(userToSave);
  } catch (error) {
    loggerService.error(`Couldn't save car`, error);
    res.status(400).send(`Couldn't save car`);
  }
}
