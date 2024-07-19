
exports.checkGreenlistKeys = (greenlist, object) => {
    const keys = Object.keys(object);
    for (let key of keys) {
        if (!greenlist.includes(key)) {
          return Promise.reject({ status: 400, message: "400 - Bad Request" });
        }
      }
    return Promise.resolve(true)
}


exports.checkGreenlistValues = (greenlist, object) => {
  const values = Object.values(object);
  for (let value of values) {
      if (!greenlist.includes(value)) {
        return Promise.reject({ status: 400, message: "400 - Bad Request" });
      }
    }
  return Promise.resolve(true)
}