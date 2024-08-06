const db = require("../../db/connection");
const { checkExists } = require("../utils/check-exists");
const format = require("pg-format");
const { formatObject } = require("../utils/format-object-for-pg-format");
const { insertTopic } = require("./topics.models");
const {
  checkGreenlistKeys,
  checkGreenlistValues,
} = require("../utils/greenlist");
const {
  exceedsMaxPage,
  offsetPageResults,
  checkValidNumbers,
} = require("../utils/articles-utils");

exports.fetchArticleById = (id) => {
  const stringQuery = `
      SELECT * 
      FROM articles 
      WHERE article_id = $1
    `;
  return db.query(stringQuery, [id]).then(({ rows }) => {
    if (rows.length === 0)
      return Promise.reject({ status: 404, message: "404 - Not Found" });
    return rows[0];
  });
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  topic,
  limit = 10,
  p = 1
) => {
  const sortGreenlist = ["created_at", "title", "author", "votes", "topic", "comment_count"];
  return checkGreenlistValues(sortGreenlist, { sort_by })
    .then(() => {
      const orderGreenlist = ["desc", "asc"];
      return checkGreenlistValues(orderGreenlist, { order });
    })
    .then(() => {
      return checkValidNumbers(limit, p);
    })
    .then((limitAndPage) => {
      let sqlIndex = 1;
      const promiseArray = [];
      let stringQuery = `
      SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::int AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      `;
      let dataQueries = [];

      if (topic) {
        promiseArray.push(checkExists("topics", "slug", topic));
        stringQuery += ` WHERE topic = $${sqlIndex++}`;
        dataQueries.push(topic);
      } else {
        promiseArray.push({ exists: true });
      }

      stringQuery += ` GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url`
      if (sort_by === "comment_count") {
        stringQuery += " ORDER BY %I"
      } else {
        stringQuery += ` ORDER BY articles.%I`
      }

      //descending alphabetical order is ascending numerical order
      if (sort_by === "title" || sort_by === "topic" || sort_by === "author") {
        order = "asc";
      }
      stringQuery += order === "asc" ? " ASC" : " DESC";

      const formattedStringQuery = format(stringQuery, sort_by);

      promiseArray.unshift(db.query(formattedStringQuery, dataQueries));
      promiseArray.push(limitAndPage);
      return Promise.all(promiseArray);
    })
    .then(([{ rows }, { exists }, [searchLimit, page]]) => {
      const total_count = rows.length;
      const exceedMaxPage = exceedsMaxPage(total_count, searchLimit, page);
      if ((total_count === 0 && !exists) || exceedMaxPage) {
        return Promise.reject({ status: 404, message: "404 - Not Found" });
      }
      const offsetPage = offsetPageResults(rows, searchLimit, page);

      return [offsetPage, total_count];
    });
};

exports.fetchCommentsByArticleId = (article_id, limit = 10, p = 1) => {
  return checkValidNumbers(limit, p).then((limitAndPage) => {
    const stringQuery = `
      SELECT comment_id, votes, created_at, author, body, article_id
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC
      `;
    const promiseArray = [];
    promiseArray.push(db.query(stringQuery, [article_id]));
    promiseArray.push(checkExists("articles", "article_id", article_id));
    promiseArray.push(limitAndPage);
    return Promise.all(promiseArray).then(
      ([{ rows }, { exists }, [searchLimit, page]]) => {
        const total_count = rows.length;
        const exceedMaxPage = exceedsMaxPage(total_count, searchLimit, page);
        if ((total_count === 0 && !exists) || exceedMaxPage) {
          return Promise.reject({ status: 404, message: "404 - Not Found" });
        }
        const offsetPage = offsetPageResults(rows, searchLimit, page);
        return [offsetPage, total_count];
      }
    );
  });
};

exports.insertCommentOntoArticle = (article_id, author, body) => {
  if (typeof body !== "string") {
    return Promise.reject({ status: 400, message: "400 - Bad Request" });
  }
  return this.fetchArticleById(article_id).then(() => {
    const stringQuery = `
          INSERT INTO comments
          (body, article_id, author)
          VALUES %L
          RETURNING *
        `;
    const data = [[body, article_id, author]];
    const formattedStringQuery = format(stringQuery, data);
    return db.query(formattedStringQuery).then(({ rows }) => {
      return rows[0];
    });
  });
};

exports.updateArticle = (article_id, value) => {
  return this.fetchArticleById(article_id).then(() => {
    const queryString = format(
      `
        UPDATE articles
        SET votes = votes + $1 
        WHERE article_id = $2
        RETURNING *
        ;`
    );
    const data = [value, article_id];
    return db.query(queryString, data).then(({ rows }) => {
      return rows[0];
    });
  });
};

exports.insertArticle = (article) => {
  const articleGreenlist = [
    "author",
    "title",
    "body",
    "topic",
    "article_img_url",
  ];
  return checkGreenlistKeys(articleGreenlist, article)
    .then(() => {
      return checkExists("topics", "slug", article.topic);
    })

    .then(({ exists }) => {
      if (!exists) {
        return insertTopic({ slug: article.topic });
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      const articleData = formatObject(article);
      let stringQuery = `INSERT INTO articles (author, title, body, topic`;
      if (article.article_img_url === undefined) {
        stringQuery += `)`;
      } else {
        stringQuery += `, article_img_url)`;
      }
      stringQuery += ` VALUES %L RETURNING *`;
      const query = format(stringQuery, [articleData]);

      return db.query(query);
    })

    .then(({ rows }) => {
      const newlyPostedArticle = rows[0];
      return { ...newlyPostedArticle, comment_count: 0 };
    });
};

exports.deleteArticle = (article_id) => {
  return this.fetchArticleById(article_id).then(() => {
    const stringQuery = `DELETE FROM articles WHERE article_id = $1`;
    return db.query(stringQuery, [article_id]);
  });
};
