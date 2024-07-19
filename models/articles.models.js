const db = require("../db/connection");
const { checkExists } = require("../utils/check-exists");
const format = require("pg-format");
const { formatObject } = require("../utils/format-object-for-pg-format");

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
  let sqlIndex = 1;
  const allowedSortBy = ["created_at", "title", "author", "votes", "topic"];
  const allowedOrders = ["desc", "asc"];
  if (!allowedSortBy.includes(sort_by) || !allowedOrders.includes(order)) {
    return Promise.reject({ status: 404, message: "404 - Not Found" });
  }

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

  stringQuery += ` GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url
    ORDER BY articles.%I`;

  //descending alphabetical order is ascending numerical order
  if (sort_by === "title" || sort_by === "topic" || sort_by === "author") {
    order = "asc";
  }
  stringQuery += order === "asc" ? " ASC" : " DESC";

  const formattedStringQuery = format(stringQuery, sort_by);

  promiseArray.unshift(db.query(formattedStringQuery, dataQueries));
  return Promise.all(promiseArray).then(([{ rows }, { exists }]) => {
    const total_count = rows.length;
    const searchLimit = Number(limit);
    const page = Number(p);

    if (isNaN(page) || isNaN(searchLimit)) {
      return Promise.reject({ status: 400, message: "400 - Bad Request" });
    }
    const maxPage =
      total_count === 0 ? 1 : Math.ceil(total_count / searchLimit);
    const exceedMaxPage = page > maxPage;
    if ((total_count === 0 && !exists) || exceedMaxPage) {
      return Promise.reject({ status: 404, message: "404 - Not Found" });
    }
    const offset = (page - 1) * searchLimit;

    const offsetArray = rows.slice(offset, offset + searchLimit);
    return [offsetArray, total_count];
  });
};

exports.fetchCommentsByArticleId = (article_id, limit=10, p=1) => {
  const stringQuery = `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    `;
  const promiseArray = [];
  promiseArray.push(db.query(stringQuery, [article_id]));
  promiseArray.push(checkExists("articles", "article_id", article_id));
  return Promise.all(promiseArray)
  .then(([{ rows }, { exists }]) => {
    const total_count = rows.length
    const searchLimit = Number(limit);
    const page = Number(p)
    if (isNaN(page) || isNaN(searchLimit)) {
      return Promise.reject({ status: 400, message: "400 - Bad Request" });
    }
    const maxPage =
      total_count === 0 ? 1 : Math.ceil(total_count / searchLimit);
    const exceedMaxPage = page > maxPage;
    if ((total_count === 0 && !exists) || exceedMaxPage) {
      return Promise.reject({ status: 404, message: "404 - Not Found" });
    }
    const offset = (page - 1) * searchLimit
    const offsetArray = rows.slice(offset, offset + searchLimit)
    return [offsetArray, total_count]
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
  const allowedKeys = ["author", "title", "body", "topic", "article_img_url"];
  const articleKeys = Object.keys(article);

  for (let key of articleKeys) {
    if (!allowedKeys.includes(key)) {
      return Promise.reject({ status: 400, message: "400 - Bad Request" });
    }
  }

  return checkExists("topics", "slug", article.topic)
    .then(({ exists }) => {
      let promiseArray = [];
      if (!exists) {
        const topicStringQuery = format(
          `INSERT INTO topics (slug) VALUES (%L);
      `,
          [article.topic]
        );
        promiseArray.push(db.query(topicStringQuery));
      } else {
        promiseArray.push("exists");
      }

      const articleData = formatObject(article);
      let stringQuery = `INSERT INTO articles (author, title, body, topic`;
      if (article.article_img_url === undefined) {
        stringQuery += `)`;
      } else {
        stringQuery += `, article_img_url)`;
      }
      stringQuery += ` VALUES %L RETURNING *`;
      const query = format(stringQuery, [articleData]);
      promiseArray.push(db.query(query));

      return Promise.all(promiseArray);
    })
    .then((result) => {
      const newlyPostedArticle = result[1].rows[0];
      return { ...newlyPostedArticle, comment_count: 0 };
    });
};
