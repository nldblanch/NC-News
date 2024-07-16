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
    it("expects every endpoint to have a string format if given one", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          const arrayOfEndpoints = Object.keys(endpoints);
          arrayOfEndpoints.forEach((endpoint) => {
            const { format } = endpoints[endpoint];
            if (format) expect(typeof format).toBe("string");
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
            const exampleResponseKeys = Object.keys(exampleResponse);
            expect(exampleResponseKeys.length).toBeGreaterThan(0);
            exampleResponseKeys.forEach((key) => {
              const responseContainsObject =
                exampleResponse[key].length > 0 ||
                Object.keys(exampleResponse[key]).length > 0;
              expect(responseContainsObject).toBe(true);
            });
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
});

describe("/api/articles", () => {
  describe("GET", () => {
    it("responds with an array of article objects each with appropriate properties", () => {
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
    it("sorts the articles in date, descending order (newest to oldest)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          const articleTimestamps = articles.map((article) => {
            return { created_at: Date.parse(article.created_at) };
          });
          expect(articleTimestamps).toBeSortedBy("created_at", {
            descending: true,
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
