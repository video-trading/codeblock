import { CodeBlock } from "../types/CodeBlock";
import { SolidityType } from "../types/SolidityType";
import { Parser } from "./Parser";
//@ts-ignore
import Solidity from "tree-sitter-solidity";
import TreeParser, { QueryCapture, SyntaxNode } from "tree-sitter";
const { Query } = TreeParser;

export class SolidityParser extends Parser<SolidityType> {
  input(input: string): Parser<SolidityType> {
    this.code = input;
    return this;
  }

  parse(): CodeBlock<SolidityType>[] {
    const parser = new TreeParser();
    parser.setLanguage(Solidity);
    const tree = parser.parse(this.code);
    // construct a query to query every single
    // @codeblock comment.
    const query = new Query(
      Solidity,
      `
      (
        (comment)+ @comment
        (#match? @comment ".*@codeblock")
     )
    `
    );
    const matches = query.matches(tree.rootNode);
    const codeBlocks: CodeBlock<SolidityType>[] = [];
    let index = 0;
    for (const match of matches) {
      const captureNode = match.captures[match.captures.length - 1];
      const codeNode = captureNode.node.nextSibling;
      if (codeNode === null) {
        // if there is no comment next to the code
        // then we will just ignore it.
        const codeBlock: CodeBlock<SolidityType> = {
          id: index,
          type: "bool",
          value: undefined,
          name: undefined,
          code: "",
          description: undefined,
          error: true,
          codeComment: undefined,
        };
        codeBlocks.push(codeBlock);
        continue;
      }
      const comment = this.getComment(match.captures);
      const codeBlock = this.getCodeblock(index, codeNode, comment);
      codeBlocks.push(codeBlock);
      index += 1;
    }
    return codeBlocks;
  }

  private getComment(captures: QueryCapture[]): string | undefined {
    if (captures.length === 1) {
      return undefined;
    }

    // comment without @codeblock annotation
    const newCaptures = captures.slice(1, captures.length);
    const comments = "".concat(
      ...newCaptures.map((capture) => this.normalizeComment(capture.node.text))
    );
    return comments;
  }

  private normalizeComment(comment: string) {
    const lines = comment.split("\n");
    let normalizedComment = "";
    for (const line of lines) {
      let trimedComment = line.trim();
      trimedComment = trimedComment.replace(/^\/\*/g, "");
      trimedComment = trimedComment.replace(/^\*\//g, "");
      trimedComment = trimedComment.replace(/^\*/g, "");
      trimedComment = trimedComment.replaceAll("*", "");
      trimedComment = trimedComment.replaceAll("\n", "");
      trimedComment = trimedComment.replaceAll(/^(\/*)/g, "");

      normalizedComment = normalizedComment.concat(trimedComment);
    }

    return normalizedComment.trim();
  }

  private getCodeblock(
    index: number,
    code: SyntaxNode,
    comment: string | undefined
  ) {
    const children = code.children;
    let type: string | undefined;
    let value: any | undefined;
    let name: string | undefined;
    let valueStartColumn: number | undefined;
    let valueEndColumn: number | undefined;
    let valueStartLine: number | undefined;
    let valueEndLine: number | undefined;

    for (const child of children) {
      if (child.type === "type_name") {
        type = child.text;
        continue;
      }

      if (child.type === "identifier") {
        name = child.text;
        continue;
      }

      if (
        child.type.includes("literal") ||
        child.type.includes("number") ||
        child.type === "true" ||
        child.type === "false"
      ) {
        value = this.getValueByType(type!, child.text);
        valueStartColumn = child.startPosition.column;
        valueEndColumn = child.endPosition.column;
        valueStartLine = child.startPosition.row;
        valueEndLine = child.endPosition.row;
        continue;
      }
    }

    const codeBlock: CodeBlock<SolidityType> = {
      id: index,
      type: type as SolidityType,
      value,
      name,
      code: code.text,
      description: comment,
      error: false,
      codeComment: comment,
      valuePosition: {
        valueStartColumn: valueStartColumn!,
        valueEndColumn: valueEndColumn!,
        valueStartLine: valueStartLine!,
        valueEndLine: valueEndLine!,
      },
    };

    return codeBlock;
  }

  private getValueByType(type: string, value: string) {
    switch (type) {
      case "uint256":
      case "uint":
      case "int256":
      case "int":
        return parseInt(value);
      case "bool":
        return value === "true";
      default:
        return value;
    }
  }
}
