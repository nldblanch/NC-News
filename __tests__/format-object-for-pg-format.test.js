const { formatObject } = require("../api/utils/format-object-for-pg-format");

describe("formatObject", () => {
  it("returns an array", () => {
    //arrange
    const object = { author: "nathan" };
    //act
    const actual = formatObject(object);
    //assert
    expect(Array.isArray(actual)).toBe(true);
  });
  it("formats an object with one key value pair", () => {
    //arrange
    const object = { author: "nathan" };
    //act
    const actual = formatObject(object);
    const expected = ["nathan"];
    //assert
    expect(actual).toEqual(expected);
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
    const actual = formatObject(object);
    const expected = [
      "nldblanch",
      "article about mitch",
      "why are there so many of them?",
      "mitch",
      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    ];
    //assert
    expect(actual).toEqual(expected);
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
    const actual = formatObject(object);
    //assert
    expect(actual).not.toBe(object);
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
    const actual = formatObject(object);
    //assert
    expect(object).toEqual(copyObject);
  });
});
