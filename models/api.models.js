const endpoints = require("../endpoints.json");

exports.fetchApi = () => {
  return Promise.resolve(endpoints);
};
