import { SolidityParser } from "./SolidityParser";

describe("Given a solidity parser", () => {
  test("Should parse int contract", () => {
    const simpleSolidityCode = `
        //@codeblock
        int greet = 0;
    `;

    const parser = new SolidityParser();
    const result = parser.input(simpleSolidityCode).parse();
    expect(result).toHaveLength(1);

    expect(result[0].type).toBe("int");
    expect(result[0].value).toBe(0);
    expect(result[0].valuePosition?.valueStartLine).toBe(2);
    expect(result[0].valuePosition?.valueEndLine).toBe(2);
    expect(result[0].valuePosition?.valueStartColumn).toBe(20);
    expect(result[0].valuePosition?.valueEndColumn).toBe(21);
  });

  test("Should parse a simple contract", () => {
    const simpleSolidityCode = `
    // SPDX-License-Identifier: MIT
    // compiler version must be greater than or equal to 0.8.13 and less than 0.9.0
    pragma solidity ^0.8.13;
    
    contract HelloWorld {
        //@codeblock
        string greet = "Hello World!";
    
        //@codeblock
        //Price of the item
        int price = 0;
    }
    `;

    const parser = new SolidityParser();
    const result = parser.input(simpleSolidityCode).parse();
    expect(result).toHaveLength(2);

    expect(result[0].type).toBe("string");
    expect(result[0].value).toContain("Hello World!");

    expect(result[1].type).toBe("int");
    expect(result[1].value).toBe(0);
    expect(result[1].codeComment).toBe("Price of the item");
    expect(result[1].description).toBe("Price of the item");
  });

  test("Should parse a simple contract", () => {
    const simpleSolidityCode = `
    // SPDX-License-Identifier: MIT
    // compiler version must be greater than or equal to 0.8.13 and less than 0.9.0
    pragma solidity ^0.8.13;
    
    contract HelloWorld {
        //@codeblock
        string greet = "Hello World!";
    
        //@codeblock
        /**
         * some very long 
         * comment
         */
        int price = 0;
    }
    `;

    const parser = new SolidityParser();
    const result = parser.input(simpleSolidityCode).parse();
    expect(result).toHaveLength(2);

    expect(result[0].type).toBe("string");
    expect(result[0].value).toContain("Hello World!");

    expect(result[1].type).toBe("int");
    expect(result[1].value).toBe(0);
    expect(result[1].codeComment).toBe("some very long comment");
    expect(result[1].description).toBe("some very long comment");
  });

  test("Should parse a simple contract", () => {
    const simpleSolidityCode = `
    // SPDX-License-Identifier: MIT
    // compiler version must be greater than or equal to 0.8.13 and less than 0.9.0
    pragma solidity ^0.8.13;
    
    contract HelloWorld {
        //@codeblock
        string greet = "Hello World!";
    
        //@codeblock
        //Price of the item
        int price = 0;
    }
    `;

    const parser = new SolidityParser();
    const result = parser.input(simpleSolidityCode).parse();
    expect(result).toHaveLength(2);

    expect(result[0].type).toBe("string");
    expect(result[0].value).toContain("Hello World!");

    expect(result[1].type).toBe("int");
    expect(result[1].value).toBe(0);
    expect(result[1].codeComment).toBe("Price of the item");
    expect(result[1].description).toBe("Price of the item");
  });

  test("Should parse a simple contract", () => {
    const simpleSolidityCode = `
        //@codeblock
        /// hello world
        int price = 0;
    `;

    const parser = new SolidityParser();
    const result = parser.input(simpleSolidityCode).parse();
    expect(result).toHaveLength(1);

    expect(result[0].type).toBe("int");
    expect(result[0].value).toBe(0);
    expect(result[0].codeComment).toBe("hello world");
    expect(result[0].description).toBe("hello world");
  });

  test("Should parse bool", () => {
    const simpleSolidityCode = `
        //@codeblock
        /// hello world
        bool price = true;
    `;

    const parser = new SolidityParser();
    const result = parser.input(simpleSolidityCode).parse();
    expect(result).toHaveLength(1);

    expect(result[0].type).toBe("bool");
    expect(result[0].value).toBe(true);
    expect(result[0].codeComment).toBe("hello world");
    expect(result[0].description).toBe("hello world");
  });

  test("Should parse bool", () => {
    const simpleSolidityCode = `
        //@codeblock
        /// hello world
        bool price = false;
    `;

    const parser = new SolidityParser();
    const result = parser.input(simpleSolidityCode).parse();
    expect(result).toHaveLength(1);

    expect(result[0].type).toBe("bool");
    expect(result[0].value).toBe(false);
    expect(result[0].codeComment).toBe("hello world");
    expect(result[0].description).toBe("hello world");
  });

  test("Should return an error block", () => {
    const simpleCode = `//@codeblock`;
    const parser = new SolidityParser();
    const result = parser.input(simpleCode).parse();
    expect(result).toHaveLength(1);
    expect(result[0].error).toBe(true);
  });

  test("Should generate code correctly", () => {
    const simpleSolidityCode = `
        //@codeblock
        int greet = 0;
    `;

    const parser = new SolidityParser();
    const result = parser.input(simpleSolidityCode).parse();
    result[0].value = 1;
    const generatedResult = parser.generate(result);
    expect(generatedResult).toBe(`
        //@codeblock
        int greet = 1;
    `);
  });

  test("Should generate code correctly", () => {
    const simpleSolidityCode = `
        //@codeblock
        int greet =10;
        //@codeblock
        int greet2 = 20;
    `;

    const parser = new SolidityParser();
    const result = parser.input(simpleSolidityCode).parse();
    result[0].value = 1;
    const generatedResult = parser.generate(result);
    expect(generatedResult).toBe(`
        //@codeblock
        int greet =1;
        //@codeblock
        int greet2 = 20;
    `);
  });
});
