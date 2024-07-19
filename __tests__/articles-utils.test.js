const {
  exceedsMaxPage,
  offsetPageResults,
  checkValidNumbers,
} = require("../api/utils/articles-utils");

describe("exceedsMaxPage", () => {
  it("returns a boolean", () => {
    const total_count = 0;
    const searchLimit = 10;
    const page = 1;
    const actual = exceedsMaxPage(total_count, searchLimit, page);
    expect(typeof actual).toBe("boolean");
  });
  it("returns true when the page is greater than the max possible page", () => {
    const total_count = 10;
    const searchLimit = 5; // max page 2
    const page = 3;
    const actual = exceedsMaxPage(total_count, searchLimit, page);
    expect(actual).toBe(true);
  });
  it("returns false when the page is less than the max possible page", () => {
    const total_count = 10;
    const searchLimit = 5; // max page 2
    const page = 1;
    const actual = exceedsMaxPage(total_count, searchLimit, page);
    expect(actual).toBe(false);
  });
  it("returns false when the page is equal to the max possible page", () => {
    const total_count = 10;
    const searchLimit = 5; // max page 2
    const page = 2;
    const actual = exceedsMaxPage(total_count, searchLimit, page);
    expect(actual).toBe(false);
  });
});

describe("offsetPageResults", () => {
  describe("takes default values of limit = 10, page = 1", () => {
    it("returns an array", () => {
      const rows = [];
      const searchLimit = 2;
      const page = 1;
      const actual = offsetPageResults(rows, searchLimit, page);
      expect(Array.isArray(actual)).toBe(true);
    });
    it("limits the return result to the search limit", () => {
      const rows = [1, 2, 3, 4];
      const searchLimit = 2;
      const page = 1;
      const actual = offsetPageResults(rows, searchLimit, page);
      expect(actual).toEqual([1, 2]);
    });
    it("offsets the result according to the page number", () => {
      const rows = [1, 2, 3, 4];
      const searchLimit = 2;
      const page = 2;
      const actual = offsetPageResults(rows, searchLimit, page);
      expect(actual).toEqual([3, 4]);
    });
    it("creates a new reference in memory", () => {
      const rows = [1, 2, 3, 4];
      const searchLimit = 2;
      const page = 2;
      const actual = offsetPageResults(rows, searchLimit, page);
      expect(actual).not.toBe(rows);
    });
    it("does not mutate the array", () => {
      const rows = [1, 2, 3, 4];
      const copyRows = [1, 2, 3, 4];
      const searchLimit = 2;
      const page = 2;
      const actual = offsetPageResults(rows, searchLimit, page);
      expect(rows).toEqual(copyRows);
    });
  });
});

describe("checkValidNumbers", () => {
  it("returns a promise sending a bad request when limit is not a valid number", () => {
    const limit = "hello";
    const p = "2";
    checkValidNumbers(limit, p)
      .then(() => {})
      .catch((error) => {
        expect(error.status).toBe(400);
        expect(error.message).toBe("400 - Bad Request");
      });
  });
  it("returns a bad request when page is not a valid number", () => {
    const limit = "2";
    const p = "hello";
    checkValidNumbers(limit, p)
      .then(() => {})
      .catch((error) => {
        expect(error.status).toBe(400);
        expect(error.message).toBe("400 - Bad Request");
      });
  });
  it("returns the limit and page converted to numbers when valid", () => {
    const limit = "2";
    const p = "5";
    checkValidNumbers(limit, p).then((actual) => {
      expect(actual).toEqual([2, 5]);
    });
  });
});
