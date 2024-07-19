const { checkGreenlistKeys, checkGreenlistValues } = require("../api/utils/greenlist");

describe("checkGreenlistKeys", () => {
  it("Returns a promise rejection if object keys don't match greenlist", () => {
    const greenlist = ["nathan", "dan", "gary"];
    const people = {
      nathan: "cool",
      dan: "cool",
      rose: "robot",
    };
    return checkGreenlistKeys(greenlist, people)
      .then(() => {
        return Promise.reject({status: 0})
      })
      .catch(({ status, message }) => {
        expect(status).toBe(400);
        expect(message).toBe("400 - Bad Request");
      });
  });
  it("continues as normal when object matches greenlist", () => {
    const greenlist = ["nathan", "dan", "gary"];
    const people = {
      nathan: "cool",
      dan: "cool",
      gary: "robot",
    };
    return checkGreenlistKeys(greenlist, people)
     .then((result) => {
       expect(result).toBe(true)
     })
     .catch(() => {
       expect(1).toBe(0)
     })
  });
});

describe("checkGreenlistValues", () => {
  it("Returns a promise rejection if object values don't match greenlist", () => {
    const greenlist = ["cool", "ice cream"];
    const people = {
      nathan: "cool",
      dan: "cool",
      rose: "robot",
    };
    return checkGreenlistValues(greenlist, people)
      .then(() => {
        return Promise.reject({status: 0})
      })
      .catch(({ status, message }) => {
        expect(status).toBe(400);
        expect(message).toBe("400 - Bad Request");
      });
  });
  it("continues as normal when object matches greenlist", () => {
    const greenlist = ["cool", "ice cream", "robot"];
    const people = {
      nathan: "cool",
      dan: "cool",
      gary: "robot",
    };
    return checkGreenlistValues(greenlist, people)
     .then((result) => {
       expect(result).toBe(true)
     })
     .catch(() => {
       expect(1).toBe(0)
     })
  });
});
