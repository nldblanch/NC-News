const { fetchUsers, fetchUserFromUsername } = require("../models/users.models");

exports.getUsers = (request, response, next) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

exports.getUserFromUsername = (request, response, next) => {
  const { username } = request.params;
  fetchUserFromUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch(next);
};
