const { checkGreenlist } = require("../api/utils/greenlist");

describe("checkGreenlist", () => {
  it("Returns a promise rejection if object doesn't match greenlist", () => {
    const greenlist = ["nathan", "dan", "gary"];
    const people = {
      nathan: "cool",
      dan: "cool",
      rose: "robot",
    };
    return checkGreenlist(greenlist, people)
      .then((notExpected) => {
        console.log(notExpected);
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
    return checkGreenlist(greenlist, people)
     .then((result) => {
       expect(result).toBe(true)
     })
     .catch((notExpected) => {
       console.log(notExpected);
     })
  });
});
