import Axios from "axios";

var axios = Axios.create({
  withCredentials: true,
});

const BASE_URL = `//localhost:3030/api/bug/`;
const BUG_KEY = "bugDB";

export const bugService = {
  query,
  getById,
  save,
  remove,
};

async function query() {
  let { data: bugs } = await axios.get(BASE_URL);
  console.log("bugs", bugs);
  return bugs;
}

async function getById(bugId) {
  const { data: bug } = await axios.get(BASE_URL + bugId);
  return bug;
}

async function remove(bugId) {
  return await axios.get(BASE_URL + bugId + "/remove");
}

async function save(bug) {
  const queryParams = `?_id=${bug._id || ""}&title=${bug.title}&severity=${
    bug.severity
  }&description=${bug.description}`;
  const { data: savedCar } = await axios.get(BASE_URL + "save/" + queryParams);
  return savedCar;
}
