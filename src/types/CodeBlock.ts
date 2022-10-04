export interface CodeBlock<T> {
  id: number;
  /**
   * Code block type.
   */
  type: T;
  /**
   * Value holds by the variable.
   */
  value?: any;
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
  /**
   * Value's position.
   * @example
   * const a = 1;
   * // valueStartColumn = 9
   * // valueEndColumn = 10
   * // valueStartLine = 1
   * // valueEndLine = 1
   */
  valuePosition?: {
    /**
     * Value's start column.
     */
    valueStartColumn: number;
    /**
     * Value's end column.
     */
    valueEndColumn: number;
    /**
     * Value's start line.
     */
    valueStartLine: number;
    /**
     * Value's end line.
     */
    valueEndLine: number;
  };
}
