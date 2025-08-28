
import { HtmlCodeResult } from '../enums/html-code-result.enum';
import { MultiFileCodeResult } from '../enums/multi-file-code-result.enum';

export class CodeParser {
  // 静态正则
  private static readonly HTML_CODE_PATTERN = /```html\s*\n([\s\S]*?)```/i;
  private static readonly CSS_CODE_PATTERN = /```css\s*\n([\s\S]*?)```/i;
  private static readonly JS_CODE_PATTERN = /```(?:js|javascript)\s*\n([\s\S]*?)```/i;

  /**
   * 解析 HTML 单文件代码
   */
  static parseHtmlCode(codeContent: string): HtmlCodeResult {
    const result = new HtmlCodeResult();
    const htmlCode = this.extractHtmlCode(codeContent);
    result.htmlCode = htmlCode && htmlCode.trim()
      ? htmlCode.trim()
      : codeContent.trim();
    return result;
  }

  /**
   * 解析多文件代码（HTML + CSS + JS）
   */
  static parseMultiFileCode(codeContent: string): MultiFileCodeResult {
    const result = new MultiFileCodeResult();
    const htmlCode = this.extractCodeByPattern(codeContent, this.HTML_CODE_PATTERN);
    const cssCode = this.extractCodeByPattern(codeContent, this.CSS_CODE_PATTERN);
    const jsCode = this.extractCodeByPattern(codeContent, this.JS_CODE_PATTERN);

    if (htmlCode && htmlCode.trim()) result.htmlCode = htmlCode.trim();
    if (cssCode && cssCode.trim()) result.cssCode = cssCode.trim();
    if (jsCode && jsCode.trim()) result.jsCode = jsCode.trim();

    return result;
  }

  /**
   * 提取 HTML 代码
   */
  private static extractHtmlCode(content: string): string | null {
    const matcher = this.HTML_CODE_PATTERN.exec(content);
    return matcher ? matcher[1] : null;
  }

  /**
   * 根据正则模式提取代码
   */
  private static extractCodeByPattern(content: string, pattern: RegExp): string | null {
    const matcher = pattern.exec(content);
    return matcher ? matcher[1] : null;
  }
}

