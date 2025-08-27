import * as fs from 'fs';
import * as path from 'path';
import { HtmlCodeResult } from '../common/enums/html-code-result.entity';
import { MultiFileCodeResult } from '../common/enums/multi-file-code-result.entity';
import { v4 as uuidv4 } from 'uuid';

export class CodeFileSaver {
  private static readonly BASE_DIR = path.join(process.cwd(), 'tmp', 'code_output');

  static saveHtmlCodeResult(result: HtmlCodeResult) {
    const dir = this.buildUniqueDir('html');
    fs.writeFileSync(path.join(dir, 'index.html'), result.htmlCode, 'utf-8');
    return dir;
  }

  static saveMultiFileCodeResult(result: MultiFileCodeResult) {
    const dir = this.buildUniqueDir('multi_file');
    fs.writeFileSync(path.join(dir, 'index.html'), result.htmlCode, 'utf-8');
    fs.writeFileSync(path.join(dir, 'style.css'), result.cssCode, 'utf-8');
    fs.writeFileSync(path.join(dir, 'script.js'), result.jsCode, 'utf-8');
    return dir;
  }

  private static buildUniqueDir(bizType: string) {
    const dir = path.join(this.BASE_DIR, `${bizType}_${uuidv4()}`);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  }
}
