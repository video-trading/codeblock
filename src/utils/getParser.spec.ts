import { getParserByLanguage } from "./getParser";

describe("getParser", () => {
  it("should return the solidity parser", () => {
    const parser = getParserByLanguage("solidity");
    expect(parser).toBeDefined();
  });

  //   it("should return the solidity parser", () => {
  //     const parser = getParserByLanguage("sol");
  //     expect(parser).toBeDefined();
  //   });

  it("should throw an error", () => {
    expect(() => getParserByLanguage("unknown")).toThrowError(
      "Unsupported language: unknown"
    );
  });
});
