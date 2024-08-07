const app = require("../api/app.js");
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
  describe("POST", () => {
    it("201: responds with the newly posted topic", () => {
      const newTopic = {
        slug: "topic name here",
        description: "description here",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic).toEqual(newTopic);
        });
    });
    it("201: provides blank description when not given one", () => {
      const newTopic = {
        slug: "topic name here",
      };
      const returnTopic = {
        slug: "topic name here",
        description: "",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic).toEqual(returnTopic);
        });
    });
    it("400: responds bad request when invalid keys given", () => {
      const newTopic = {
        slug: "topic name here",
        wrongKey: "description here",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toEqual("400 - Bad Request");
        });
    });
    it("400: responds bad request when missing data entries", () => {
      const newTopic = {
        description: "description here",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toEqual("400 - Bad Request");
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
  describe("DELETE", () => {
    it("204: deletes the article, no response content", () => {
      const input_article_id = 1;
      return request(app)
        .delete(`/api/articles/${input_article_id}`)
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
    it("204 / 404: deletes any corresponding to the article", () => {
      const input_article_id = 1;
      return request(app)
        .delete(`/api/articles/${input_article_id}`)
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
          return request(app)
            .get(`/api/articles/${input_article_id}/comments`)
            .expect(404)
            .then(({ body: { message } }) => {
              expect(message).toBe("404 - Not Found");
            });
        });
    });
    it("404: returns not found when article id doesn't exist", () => {
      const input_article_id = 9000;
      return request(app)
        .delete(`/api/articles/${input_article_id}`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - Not Found");
        });
    });
    it("400: returns bad request when invalid data type given", () => {
      const input_article_id = "hello";
      return request(app)
        .delete(`/api/articles/${input_article_id}`)
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
    describe("Queries ???", () => {
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
        it("200: allows the user to sort articles by any valid column (comment_count, default descending)", () => {
          return request(app)
            .get("/api/articles?sort_by=comment_count")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("comment_count", {
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
        it("400: only allows greenlisted sortby queries", () => {
          return request(app)
            .get("/api/articles?sort_by=bananas")
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("400 - Bad Request");
            });
        });
      });
      describe("?order=", () => {
        it("200: allows user to choose whether the order is ascending or descending", () => {
          return request(app)
            .get("/api/articles?sort_by=votes&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toBeSortedBy("votes", {
                descending: false,
              });
            });
        });
        it("400: doesnt allow invalid orders", () => {
          return request(app)
            .get("/api/articles?sort_by=author&order=anything_I_want")
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("400 - Bad Request");
            });
        });
      });
      describe("?topic=", () => {
        it("200: allows user to filter articles by topic", () => {
          const input_topic = "mitch";
          return request(app)
            .get(`/api/articles?topic=${input_topic}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).toBeGreaterThan(0);
              articles.forEach((article) => {
                expect(article.topic).toBe(input_topic);
              });
            });
        });
        it("200: returns with empty array when search topic exists but yields no results", () => {
          const input_topic = "paper";
          return request(app)
            .get(`/api/articles?topic=${input_topic}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).toEqual([]);
            });
        });
        it("404: returns with error when search topic does not exist", () => {
          const input_topic = "nathan";
          return request(app)
            .get(`/api/articles?topic=${input_topic}`)
            .expect(404)
            .then(({ body: { message } }) => {
              expect(message).toEqual("404 - Not Found");
            });
        });
      });
      it("200: does not attempt any sort, resulting in default, when invalid sort key given", () => {
        const wrongKey = "bananas";
        return request(app)
          .get(`/api/articles?${wrongKey}=votes`)
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
    });
    describe("pagination", () => {
      describe("?limit=", () => {
        it("200: responds with an array able to be limited to a number of results", () => {
          const query = "limit";
          const value = 10;
          return request(app)
            .get(`/api/articles?${query}=${value}`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).toBe(value);
            });
        });

        it("400: responds bad request when limit is invalid", () => {
          return request(app)
            .get(`/api/articles?limit=bananas`)
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("400 - Bad Request");
            });
        });
      });
      describe("?p=", () => {
        it("200: allows user to choose the starting page, p", () => {
          const alphabeticalSix = {
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 11,
          };
          const alphabeticalSeven = {
            author: "butter_bridge",
            title: "Moustache",
            article_id: 12,
            topic: "mitch",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
          };
          return request(app)
            .get(`/api/articles?sort_by=title&limit=5&p=2`)
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).toBe(5);
              expect(articles[0]).toEqual(alphabeticalSix);
              expect(articles[1]).toEqual(alphabeticalSeven);
            });
        });
        it("200: displays total_count, the number of articles after being filtered", () => {
          return request(app)
            .get(`/api/articles?limit=5&p=3`)
            .expect(200)
            .then(({ body: { total_count, articles } }) => {
              expect(articles.length).toBe(3);
              expect(total_count).toBe(13);
            });
        });
        it("404: responds not found when page number exceeds max page", () => {
          return request(app)
            .get(`/api/articles?limit=5&p=4`)
            .expect(404)
            .then(({ body: { message } }) => {
              expect(message).toBe("404 - Not Found");
            });
        });
        it("400: responds bad request when page number is invalid", () => {
          return request(app)
            .get(`/api/articles?limit=5&p=bananas`)
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("400 - Bad Request");
            });
        });
      });
    });
  });
  describe("POST", () => {
    it("201: responds with posted article", () => {
      const postArticle = {
        author: "butter_bridge",
        title: "article about mitch",
        body: "why are there so many of them?",
        topic: "mitch",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .post("/api/articles")
        .send(postArticle)
        .expect(201)
        .then(({ body: { article } }) => {
          const { article_id, votes, created_at, comment_count } = article;
          expect(article).toMatchObject(postArticle);
          expect(typeof article_id).toBe("number");
          expect(votes).toBe(0);
          expect(typeof created_at).toBe("string");
          expect(comment_count).toBe(0);
        });
    });
    it("201: responds with posted article containing default image if not provided", () => {
      const postArticle = {
        author: "butter_bridge",
        title: "article about mitch",
        body: "why are there so many of them?",
        topic: "mitch",
      };
      return request(app)
        .post("/api/articles")
        .send(postArticle)
        .expect(201)
        .then(({ body: { article } }) => {
          const { article_img_url } = article;
          expect(article_img_url).toBe(
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
          );
        });
    });
    it("201: creates new topic when topic doesn't exist", () => {
      const postArticle = {
        author: "butter_bridge",
        title: "article about mitch",
        body: "why are there so many of them?",
        topic: "Over Population",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .post("/api/articles")
        .send(postArticle)
        .expect(201)
        .then(() => {
          return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body: { topics } }) => {
              const topicSlugs = topics.map((topic) => {
                return topic.slug;
              });
              expect(topicSlugs.includes("Over Population")).toBe(true);
            });
        });
    });
    it("404: responds not found when user doesn't exists", () => {
      const postArticle = {
        author: "nathanBlanch",
        title: "article about mitch",
        body: "why are there so many of them?",
        topic: "mitch",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .post("/api/articles")
        .send(postArticle)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
        });
    });
    it("400: responds bad request when invalid data keys given", () => {
      const postArticle = {
        author: "butter_bridge",
        wrongKey: 9000,
        body: 200015,
        topic: "mitch",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .post("/api/articles")
        .send(postArticle)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("400: responds bad request when missing data entries", () => {
      const postArticle = {
        author: "butter_bridge",
        body: 200015,
        topic: "mitch",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .post("/api/articles")
        .send(postArticle)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
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
    describe("pagination", () => {
      describe("?limit=", () => {
        it("200: allows array of comments to be limited", () => {
          const query = "limit";
          const value = 5;
          return request(app)
            .get(`/api/articles/1/comments?${query}=${value}`)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).toBe(value);
            });
        });
        it("200: defaults to a limit of 10", () => {
          return request(app)
            .get(`/api/articles/1/comments`)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).toBe(10);
            });
        });
        it("400: responds bad request when limit is invalid", () => {
          return request(app)
            .get(`/api/articles/1/comments?limit=bananas`)
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("400 - Bad Request");
            });
        });
      });
      describe("?p=", () => {
        it("200: allows user to choose the starting page, p", () => {
          const limit2Page2Comment1 = {
            comment_id: 18,
            votes: 16,
            created_at: "2020-07-21T00:20:00.000Z",
            author: "butter_bridge",
            body: "This morning, I showered for nine minutes.",
            article_id: 1,
          };
          const limit2Page2Comment2 = {
            comment_id: 13,
            votes: 0,
            created_at: "2020-06-15T10:25:00.000Z",
            author: "icellusedkars",
            body: "Fruit pastilles",
            article_id: 1,
          };
          return request(app)
            .get(`/api/articles/1/comments?limit=2&p=2`)
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).toBe(2);
              expect(comments[0]).toEqual(limit2Page2Comment1);
              expect(comments[1]).toEqual(limit2Page2Comment2);
            });
        });
        it("200: displays total_count, the number of comments after being searched", () => {
          return request(app)
            .get(`/api/articles/1/comments?limit=2&p=3`)
            .expect(200)
            .then(({ body: { total_count, comments } }) => {
              expect(comments.length).toBe(2);
              expect(total_count).toBe(11);
            });
        });
        it("404: responds not found when page number exceeds max page", () => {
          return request(app)
            .get(`/api/articles/1/comments?limit=2&p=7`)
            .expect(404)
            .then(({ body: { message } }) => {
              expect(message).toBe("404 - Not Found");
            });
        });
        it("400: responds bad request when page number is invalid", () => {
          return request(app)
            .get(`/api/articles/1/comments?limit=5&p=bananas`)
            .expect(400)
            .then(({ body: { message } }) => {
              expect(message).toBe("400 - Bad Request");
            });
        });
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
    it("404: responds with bad request when user doesn't yet exist in database", () => {
      const input_article_id = 1;
      const sentComment = {
        username: "nldblanch",
        body: "my first ever commment",
      };
      return request(app)
        .post(`/api/articles/${input_article_id}/comments`)
        .send(sentComment)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - User not found");
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
  describe("PATCH", () => {
    it("200: increments a given comment and returns the comment", () => {
      const input_comment_id = 1;
      const patchInfo = { inc_votes: 1 };
      return request(app)
        .patch(`/api/comments/${input_comment_id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toBe(17);
        });
    });
    it("200: decrements a given comment", () => {
      const input_comment_id = 1;
      const patchInfo = { inc_votes: -1 };
      return request(app)
        .patch(`/api/comments/${input_comment_id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toBe(15);
        });
    });
    it("200: ignores additional keys on patch info", () => {
      const input_comment_id = 1;
      const patchInfo = { inc_votes: 10, extraKey: 0 };
      return request(app)
        .patch(`/api/comments/${input_comment_id}`)
        .send(patchInfo)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).toBe(26);
        });
    });
    it("404: returns not found when comment doesn't exist", () => {
      const input_comment_id = 90009;
      const patchInfo = { inc_votes: 1 };
      return request(app)
        .patch(`/api/comments/${input_comment_id}`)
        .send(patchInfo)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - Not Found");
        });
    });
    it("400: returns bad request when given invalid id", () => {
      const input_comment_id = "hello bananas";
      const patchInfo = { inc_votes: -1 };
      return request(app)
        .patch(`/api/comments/${input_comment_id}`)
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("400: returns bad request when given incorrect data types", () => {
      const input_comment_id = 1;
      const patchInfo = { inc_votes: "; drop table if exists finances;" };
      return request(app)
        .patch(`/api/comments/${input_comment_id}`)
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("400: returns bad request when not given correct patch key", () => {
      const input_comment_id = 1;
      const patchInfo = { dropTable: 1 };
      return request(app)
        .patch(`/api/comments/${input_comment_id}`)
        .send(patchInfo)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
  });
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
  describe("POST", () => {
    it("201: responds with posted user containing default avatar image", () => {
      const postUser = {
        username: "nldblanch",
        name: "Nathan Blanch",
      };
      return request(app)
        .post("/api/users")
        .send(postUser)
        .expect(201)
        .then(({ body: { user } }) => {
          const { avatar_url } = user;
          expect(user).toMatchObject(postUser);
          expect(avatar_url).toBe("https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon");
        });
    });
    it("200: does not create new user when username exists (Netlify will refuse new usernames, so this prevents a new user created on successful login)", () => {
      const postUser = {
        username: "lurker",
        name: "Nathan Blanch",
      };
      return request(app)
        .post("/api/users")
        .send(postUser)
        .expect(200)
        .then(({ body: { message } }) => {
          expect(message).toBe("User already exists. Successful login.");
        });
    });
    it("400: responds bad request when invalid data keys given", () => {
      const postUser = {
        usern: "nldblanch",
        name: "Nathan Blanch",
      };
      return request(app)
        .post("/api/users")
        .send(postUser)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
    it("400: responds bad request when missing data entries", () => {
      const postUser = {
        username: "nldblanch",
      };
      return request(app)
        .post("/api/users")
        .send(postUser)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("400 - Bad Request");
        });
    });
  })
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    it("200: returns the user associated with the username", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toEqual({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
    it("404: returns not found when user doesn't exist", () => {
      return request(app)
        .get("/api/users/nldblanch")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("404 - Not Found");
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
