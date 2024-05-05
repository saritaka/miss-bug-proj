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
  getDefaultFilter,
  getFilterFromSearchParams,
};

async function query(filterBy = {}) {
  let { data: bugs } = await axios.get(BASE_URL);

  // if (filterBy.txt) {
  //   console.log("filterby,txt", filterBy.txt);
  //   bugs = bugs.filter((bug) =>
  //     bug.title.toLowerCase().includes(filterBy.txt.toLowerCase())
  //   );
  // }

  // if (filterBy.severity) {
  //   bugs = bugs.filter((bug) => bug.severity >= filterBy.severity);
  // }
  // console.log("bugs", bugs);
  return bugs;
}

async function getById(bugId) {
  const { data: bug } = await axios.get(BASE_URL + bugId);
  return bug;
}

async function remove(bugId) {
  return await axios.delete(BASE_URL + bugId);
}

async function save(bug) {
  // const queryParams = `?_id=${bug._id || ""}&title=${bug.title}&severity=${
  //   bug.severity
  // }&description=${bug.description}`;
  // const { data: savedCar } = await axios.get(BASE_URL + "save/" + queryParams);
  const method = bug._id ? "put" : "post";
  const { data: savedCar } = await axios[method](
    BASE_URL + (bug._id || ""),
    bug
  );
  return savedCar;
}

function getDefaultFilter() {
  return { txt: "", severity: 0 };
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter();
  const filterBy = {};
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || "";
  }
  console.log("filterby in server", filterBy);
  return filterBy;
}
