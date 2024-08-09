const {
  fetchUsers,
  fetchUserFromUsername,
  postNewUser,
} = require("../models/users.models");

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

exports.postUser = (request, response, next) => {
  const user = request.body;
  postNewUser(user)
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch(next);
};
