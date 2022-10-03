export interface CodeBlock<T> {
  id: number;
  /**
   * Code block type.
   */
  type: T;
  /**
   * Value holds by the variable.
   */
  value?: string;
  /**
   * Variable name.
   */
  name?: string;
  /**
   * Original code.
   */
  code: string;
  /**
   * Comments
   */
  description?: string;
  /**
   * Has parsing error
   */
  error: boolean;
  /**
   * Code's comment.
   */
  codeComment?: string;
}
