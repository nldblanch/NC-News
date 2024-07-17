const app = require("../app.js");
const request = require("supertest");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET", () => {
    it("responds with an object containing the available endpoints and descriptions", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(typeof endpoints).toBe("object");
          expect(Object.keys(endpoints).length).toBeGreaterThan(0);
        });
    });
    it("every every endpoint to have a METHOD and an endpoint", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          const arrayOfEndpoints = Object.keys(endpoints);
          arrayOfEndpoints.forEach((endpoint) => {
            expect(typeof endpoint).toBe("string");
            expect(/[A-Z]*/.test(endpoint)).toBe(true);
            expect(/\/.*[\w]$/.test(endpoint)).toBe(true);
          });
        });
    });
    it("expects every endpoint to have a description", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          const arrayOfEndpoints = Object.keys(endpoints);
          arrayOfEndpoints.forEach((endpoint) => {
            const { description } = endpoints[endpoint];
            expect(typeof description).toBe("string");
          });
        });
    });
    it("expects every endpoint to have an array of allowed queries", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          const arrayOfEndpoints = Object.keys(endpoints);
          arrayOfEndpoints.forEach((endpoint) => {
            const { queries } = endpoints[endpoint];
            expect(Array.isArray(queries)).toBe(true);
            queries.forEach((query) => {
              expect(typeof query).toBe("string");
            });
          });
        });
    });
    it("expects every endpoint to have a format object if given one", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          const arrayOfEndpoints = Object.keys(endpoints);
          arrayOfEndpoints.forEach((endpoint) => {
            const { format } = endpoints[endpoint];
            if (format) expect(typeof format).toBe("object");
          });
        });
    });
    it("expects every endpoint to have an example response object that contains responses", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          const arrayOfEndpoints = Object.keys(endpoints);
          arrayOfEndpoints.forEach((endpoint) => {
            const { exampleResponse } = endpoints[endpoint];
            expect(typeof exampleResponse).toBe("object");
          });
        });
    });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    it("responds with an array of objects that have slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(Array.isArray(topics)).toBe(true);
          expect(topics.length).toBeGreaterThan(0);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    it("responds with an article when given an id", () => {
      const article_id = 1;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(article.article_id).toBe(article_id);
          expect(typeof article.body).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        });
    });
    it("responds with a bad request when given inappropriate data type", () => {
      const article_id = "wrong id type";
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("responds with 404 when article of id doesn't exist", () => {
      const article_id = 9000;
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - Not Found");
        });
    });
  });
  describe("PATCH", () => {
    it("200: increments the votes property on an article", () => {
      const input_article_id = 1;
      const newVote = 1;
      const patchInfo = { inc_votes: newVote };
      const expectedReturnArticle = {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 101,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .patch(`/api/articles/${input_article_id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject(expectedReturnArticle);
        });
    });
    it("200: decerements the votes property", () => {
      const input_article_id = 1;
      const newVote = -100;
      const patchInfo = { inc_votes: newVote };
      const expectedReturnArticle = {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .patch(`/api/articles/${input_article_id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject(expectedReturnArticle);
        });
    });
    it("200: ignores extra keys on patch info", () => {
      const input_article_id = 1;
      const newVote = 1;
      const patchInfo = { inc_votes: newVote, extraKey: 0 };
      const expectedReturnArticle = {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 101,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .patch(`/api/articles/${input_article_id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject(expectedReturnArticle);
        });
    });
    it("404: returns not found when article id doesn't exist", () => {
      const input_article_id = 9000;
      const newVote = 1;
      const patchInfo = { inc_votes: newVote };
      return request(app)
        .patch(`/api/articles/${input_article_id}`)
        .send(patchInfo)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - Not Found");
        });
    });
    it("400: returns bad request when invalid id given", () => {
      const input_article_id = "not right";
      const newVote = 1;
      const patchInfo = { inc_votes: newVote };
      return request(app)
        .patch(`/api/articles/${input_article_id}`)
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("400: returns bad request when given incorrect object data types", () => {
      const input_article_id = 1;
      const newVote = "hello";
      const patchInfo = { inc_votes: newVote };
      return request(app)
        .patch(`/api/articles/${input_article_id}`)
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("400: returns bad request when not given correct data key", () => {
      const input_article_id = 1;
      const newVote = "hello";
      const patchInfo = { different_key: newVote };
      return request(app)
        .patch(`/api/articles/${input_article_id}`)
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    it("200: responds with an array of article objects each with appropriate properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    it("200: sorts the articles in date, descending order (newest to oldest)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("?sort_by=", () => {
    it("200: allows the user to sort articles by title, default alphabetical order", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title", {
            descending: false,
          });
        });
    });
    it("200: allows the user to sort articles by any valid column (topic, default alphabetical)", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("topic", {
            descending: false,
          });
        });
    });
    it("200: allows the user to sort articles by any valid column (author, default alphabetical)", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author", {
            descending: false,
          });
        });
    });
    it("200: allows the user to sort articles by any valid column (votes, default descending)", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes", {
            descending: true,
          });
        });
    });
    it("200: allows the user to sort articles by any valid column (created_at, default descending)", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("200: allows user to choose whether the order is ascending or descending", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes", {
            descending: false,
          });
        });
    });
    it("405: only allows greenlisted sortby and order queries", () => {
      return request(app)
        .get("/api/articles?sort_by=bananas")
        .expect(405)
        .then(({ body: { message } }) => {
          expect(message).toBe("405 - Method Not Allowed");
        });
    });
    it("200: defaults to descending (alphabetical ascending) when invalid order given", () => {
      return request(app)
        .get("/api/articles?sort_by=author&&order=anything_I_want")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("author", {
            descending: false,
          });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    it("returns an array of all the comments on an article given the article id", () => {
      const input_article_id = 1;
      return request(app)
        .get(`/api/articles/${input_article_id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(Array.isArray(comments)).toBe(true);

          comments.forEach((comment) => {
            expect(Object.keys(comment).length).toBe(6);
            const { comment_id, votes, created_at, author, body, article_id } =
              comment;
            expect(typeof comment_id).toBe("number");
            expect(typeof votes).toBe("number");
            expect(typeof created_at).toBe("string");
            expect(typeof author).toBe("string");
            expect(typeof body).toBe("string");
            expect(article_id).toBe(input_article_id);
          });
        });
    });
    it("400: Responds with 400 when given invalid data type", () => {
      const input_article_id = "wrong data type";
      return request(app)
        .get(`/api/articles/${input_article_id}/comments`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("404: Responds with 404 when the article with given id does not exist", () => {
      const input_article_id = 9000;
      return request(app)
        .get(`/api/articles/${input_article_id}/comments`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - Not Found");
        });
    });
    it("200: Responds with 200 and empty array when the article exists but no comments are found", () => {
      const input_article_id = 2;
      return request(app)
        .get(`/api/articles/${input_article_id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
  });
  describe("POST", () => {
    it("201: responds with the posted comment on the article", () => {
      const input_article_id = 1;
      const sentComment = {
        username: "butter_bridge",
        body: "my first ever commment",
      };
      return request(app)
        .post(`/api/articles/${input_article_id}/comments`)
        .send(sentComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          const { comment_id, votes, created_at, author, body, article_id } =
            comment;
          expect(typeof comment_id).toBe("number");
          expect(votes).toBe(0);
          expect(typeof created_at).toBe("string");
          expect(author).toBe(sentComment.username);
          expect(body).toBe(sentComment.body);
          expect(article_id).toBe(input_article_id);
        });
    });
    it("201: ignores additional keys on body", () => {
      const input_article_id = 1;
      const sentComment = {
        username: "butter_bridge",
        body: "my not so first comment",
        extraKey: 0,
      };
      return request(app)
        .post(`/api/articles/${input_article_id}/comments`)
        .send(sentComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          const { comment_id, votes, created_at, author, body, article_id } =
            comment;
          expect(Object.keys(comment).length).toBe(6);
          expect(typeof comment_id).toBe("number");
          expect(votes).toBe(0);
          expect(typeof created_at).toBe("string");
          expect(author).toBe(sentComment.username);
          expect(body).toBe(sentComment.body);
          expect(article_id).toBe(input_article_id);
        });
    });
    it("400: responds with bad request when user doesn't yet exist in database", () => {
      const input_article_id = 1;
      const sentComment = {
        username: "nldblanch",
        body: "my first ever commment",
      };
      return request(app)
        .post(`/api/articles/${input_article_id}/comments`)
        .send(sentComment)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - User does not exist");
        });
    });
    it("400: responds with bad request when invalid data type for id", () => {
      const input_article_id = "invalid data type";
      const sentComment = {
        username: "butter_bridge",
        body: "my first ever commment",
      };
      return request(app)
        .post(`/api/articles/${input_article_id}/comments`)
        .send(sentComment)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("400: responds with bad request when invalid data types given to object", () => {
      const input_article_id = 1;
      const sentComment = { username: "butter_bridge", body: 200 };
      return request(app)
        .post(`/api/articles/${input_article_id}/comments`)
        .send(sentComment)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("400: responds with bad request when object body is missing entries", () => {
      const input_article_id = "invalid data type";
      const sentComment = { username: "butter_bridge" };
      return request(app)
        .post(`/api/articles/${input_article_id}/comments`)
        .send(sentComment)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("404: responds with not found when article corresponding to id does not exist", () => {
      const input_article_id = 9000;
      const sentComment = {
        username: "butter_bridge",
        body: "my first ever commment",
      };
      return request(app)
        .post(`/api/articles/${input_article_id}/comments`)
        .send(sentComment)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - Not Found");
        });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    it("204: deletes the comment, no response content", () => {
      const input_comment_id = 1;
      return request(app)
        .delete(`/api/comments/${input_comment_id}`)
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    it("404: returns not found when comment id doesn't exist", () => {
      const input_comment_id = 9000;
      return request(app)
        .delete(`/api/comments/${input_comment_id}`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - Not Found");
        });
    });
    it("400: returns bad request when given invalid id data type", () => {
      const input_comment_id = "hello";
      return request(app)
        .delete(`/api/comments/${input_comment_id}`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    it("responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(Array.isArray(users)).toBe(true);
          expect(users.length).toBeGreaterThan(0);
          users.forEach((user) => {
            const { username, name, avatar_url } = user;
            expect(typeof username).toBe("string");
            expect(typeof name).toBe("string");
            expect(typeof avatar_url).toBe("string");
          });
        });
    });
  });
});

describe("generic error handling", () => {
  it("responds with a 404 error when a non-existent endpoint is reached", () => {
    return request(app)
      .get("/api/this_endpoint_is_bananas")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("404 - Not Found");
      });
  });
});
