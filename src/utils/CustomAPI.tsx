export const API_URL = "http://localhost:5000";

export const fetchFiles = () =>
  fetch(API_URL + "/list").then(resp => resp.json());
