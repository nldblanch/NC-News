const { fetchTopics, insertTopic } = require("../models/topics.models");

exports.getTopics = (request, response, next) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

exports.postTopic = (request, response, next) => {
  const newTopic = request.body
  insertTopic(newTopic)
  .then((topic) => {
    response.status(201).send({topic})
  })
  .catch(next)
}
