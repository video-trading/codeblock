import { CodeBlock } from "../types/CodeBlock";

export abstract class Parser<T> {
  /**
   * Code
   */
  protected code!: string;

  /**
   * Take user's input
   * @param input Code to parse
   */
  abstract input(input: string): Parser<T>;

  /**
   * Generate code blocks
   */
  abstract parse(): CodeBlock<T>[];

  private replaceBetween(
    start: number,
    end: number,
    what: string,
    original: string
  ): string {
    return original.substring(0, start) + what + original.substring(end);
  }

  generate(blocks: CodeBlock<T>[]): string {
    let lines = this.code.split("\n");
    for (const block of blocks) {
      if (block.valuePosition === undefined) {
        continue;
      }

      const blockPosition = block.valuePosition!;
      let newLine = this.replaceBetween(
        blockPosition.valueStartColumn,
        blockPosition.valueEndColumn,
        block.value!,
        lines[blockPosition.valueStartLine]
      );
      lines[blockPosition.valueStartLine] = newLine;
    }

    this.code = lines.join("\n");
    return this.code;
  }
}
