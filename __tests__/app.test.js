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

describe("/api/topics", () => {
  describe("GET", () => {
    it("responds with an array of objects that have slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: {topics} }) => {
          expect(Array.isArray(topics)).toBe(true);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
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
    .then(({body: {message}}) => {
      expect(message).toBe("404 - Not Found")
    })
  })
})