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
