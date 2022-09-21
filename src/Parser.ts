import { CodeBlock } from "./types/CodeBlock";

abstract class Parser<T> {
  /**
   * Code
   */
  protected abstract code: string;

  /**
   * Take user's input
   * @param input Code to parse
   */
  abstract input(input: string): Parser<T>;

  /**
   * Generate code blocks
   */
  abstract parse(): CodeBlock<T>[];
}
