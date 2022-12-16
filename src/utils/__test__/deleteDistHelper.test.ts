import deleteDistHelper from "../deleteDistHelper";

describe("deleteDistHelper.test", () => {
  it("deleteDistHelper", () => {
    expect(
      deleteDistHelper(
        "dist\\images\\team-crests\\gornik-logo-01___20221214-120129.png"
      )
    ).toEqual("images\\team-crests\\gornik-logo-01___20221214-120129.png");
  });

  expect(
    deleteDistHelper(
      "images\\team-crests\\gornik-logo-01___20221214-120129.png"
    )
  ).toEqual("images\\team-crests\\gornik-logo-01___20221214-120129.png");
});

export {};
