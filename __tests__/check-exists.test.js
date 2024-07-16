const { checkExists } = require("../utils/check-exists");
const db = require("../db/connection.js");

afterAll(() => {
  return db.end();
});

describe("checkExists", () => {
  it("returns false when given item does not exist in the database", () => {
    const id = 9000;
    return checkExists("articles", "article_id", id).then((result) => {
      expect(result.exists).toBe(false);
    });
  });
  it("returns when given item exists in the database", () => {
    const id = 1;
    return checkExists("articles", "article_id", id).then((result) => {
      expect(result.exists).toBe(true);
    });
  });
});
