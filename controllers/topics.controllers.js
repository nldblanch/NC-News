const { fetchApi, fetchTopics } = require("../models/topics.models");

exports.getApi = (request, response, next) => {
  fetchApi().then((endpoints) => {
    response.status(200).send({ endpoints });
  });
};

exports.getTopics = (request, response, next) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};
