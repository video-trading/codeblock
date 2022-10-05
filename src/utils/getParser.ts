import { Parser } from "../parser/Parser";
import { SolidityParser } from "../parser/SolidityParser";

export function getParserByLanguage(language: string): Parser<any> {
  switch (language) {
    case "solidity":
    case "sol":
      return new SolidityParser();
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}
