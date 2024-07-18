const { formatObject } = require("../utils/format-object-for-pg-format");

describe("formatObject", () => {
  it("returns an array", () => {
    //arrange
    const object = { author: "nathan" };
    //act
    formatObject(object).then((actual) => {
      //assert
      expect(Array.isArray(actual)).toBe(true);
    });
  });
  it("formats an object with one key value pair", () => {
    //arrange
    const object = { author: "nathan" };
    //act
    const expected = ["nathan"];
    formatObject(object).then((actual) => {
      //assert
      expect(actual).toEqual(expected);
    });
  });
  it("formats an object with many key value pairs", () => {
    //arrange
    const object = {
      author: "nldblanch",
      title: "article about mitch",
      body: "why are there so many of them?",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    //act
    const expected = [
      "nldblanch",
      "article about mitch",
      "why are there so many of them?",
      "mitch",
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    ];
    formatObject(object).then((actual) => {
      //assert
      expect(actual).toEqual(expected);
    });
  });
  it("creates a new reference in memory for the return object", () => {
    //arrange
    const object = {
      author: "nldblanch",
      title: "article about mitch",
      body: "why are there so many of them?",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    //act
    formatObject(object).then((actual) => {
      //assert
      expect(actual).not.toBe(object);
    });
  });
  it("does not mutate the input object", () => {
    //arrange
    const object = {
      author: "nldblanch",
      title: "article about mitch",
      body: "why are there so many of them?",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    const copyObject = {
      author: "nldblanch",
      title: "article about mitch",
      body: "why are there so many of them?",
      topic: "mitch",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    //act
    formatObject(object).then((actual) => {
      //assert
      expect(object).toEqual(copyObject);
    });
  });
});
