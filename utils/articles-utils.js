exports.exceedsMaxPage = (total_count, searchLimit, page) => {
    const maxPage = total_count === 0 ? 1 : Math.ceil(total_count / searchLimit);
    return page > maxPage;
  };

exports.offsetPageResults = (rows, searchLimit, page) => {
    const offset = (page - 1) * searchLimit;
    const offsetResult = rows.slice(offset, offset + searchLimit);
    return offsetResult;
};

exports.checkValidNumbers = (limit, p) => {
    const searchLimit = Number(limit);
    const page = Number(p);
    if (isNaN(page) || isNaN(searchLimit)) {
      return Promise.reject({ status: 400, message: "400 - Bad Request" });
    } else {
      return Promise.resolve([searchLimit, page]);
    }
  };