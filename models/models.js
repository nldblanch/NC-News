const db = require("../db/connection");
const endpoints = require("../endpoints.json");
const format = require("pg-format");
const { checkExists } = require("../utils/check-exists");
exports.fetchApi = () => {
  return Promise.resolve(endpoints);
};

exports.fetchTopics = () => {
  const stringQuery = `
  SELECT slug, description 
  FROM topics
  `;
  return db.query(stringQuery).then(({ rows }) => {
    return rows;
  });
};

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

exports.fetchArticles = (sort_by = "created_at", order = "desc") => {
  const allowedQueries = ["created_at", "title", "author", "votes", "topic"];
  if (!allowedQueries.includes(sort_by)) {
    return Promise.reject({ status: 405, message: "405 - Method Not Allowed" });
  }

  let stringQuery = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id)::int AS comment_count
  FROM articles
  LEFT JOIN comments
    ON articles.article_id = comments.article_id
  GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url
  ORDER BY articles.%I
  `;
  //descending alphabetical order is ascending numerical order
  if (sort_by === "title" || sort_by === "topic" || sort_by === "author") {
    order = "asc";
  }
  stringQuery += order === "asc" ? "ASC" : "DESC";

  const formattedStringQuery = format(stringQuery, sort_by);
  return db.query(formattedStringQuery).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByArticleId = (article_id) => {
  const stringQuery = `
  SELECT comment_id, votes, created_at, author, body, article_id
  FROM comments
  WHERE article_id = $1
  `;
  const promiseArray = [];
  promiseArray.push(db.query(stringQuery, [article_id]));
  promiseArray.push(checkExists("articles", "article_id", article_id));
  return Promise.all(promiseArray).then(([{ rows }, { exists }]) => {
    if (rows.length === 0 && !exists) {
      return Promise.reject({ status: 404, message: "404 - Not Found" });
    }
    return rows;
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

exports.deleteComment = (comment_id) => {
  return checkExists("comments", "comment_id", comment_id).then(
    ({ exists }) => {
      if (!exists) {
        return Promise.reject({ status: 404, message: "404 - Not Found" });
      }

      const stringQuery = `
    DELETE FROM comments
    WHERE comment_id = $1
    `;
      return db.query(stringQuery, [comment_id]);
    }
  );
};

exports.fetchUsers = () => {
  const stringQuery = `
  SELECT * FROM USERS`;
  return db.query(stringQuery).then(({ rows }) => {
    return rows;
  });
};
