import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AiService } from './ai/ai.service';
import { CodeGenTypeEnum } from './common/enums/code-gen-type.enum';
import { CodeFileSaver } from './core/code-file-saver';
import { HtmlCodeResult } from './common/enums/html-code-result.entity';
import { CodeParser } from "./common/utils/CodeParser"
@Injectable()
export class AiCodeGeneratorFacade {
  constructor(private readonly aiService: AiService) {}
  /**
   * 统一入口：根据类型生成并保存代码（流式）
   */
  generateAndSaveCodeStream(
    userMessage: string,
    type: CodeGenTypeEnum,
  ): Observable<string> {
    if (!type) {
      throw new InternalServerErrorException('生成类型为空');
    }

    switch (type) {
      case CodeGenTypeEnum.HTML:
        return this.processCodeStream(
          this.aiService.generateHtmlCodeStream(userMessage),
          type,
        );
      case CodeGenTypeEnum.MULTI_FILE:
        return this.processCodeStream(
          this.aiService.generateMultiFileCodeStream(userMessage),
          type,
        );
      default:
        throw new InternalServerErrorException(`不支持的生成类型: ${type}`);
    }
  }

  /**
   * 流式处理，可在此落库或做日志
   */
  private processCodeStream(stream: Observable<string>, type: CodeGenTypeEnum): Observable<string> {
    // return stream;
    return new Observable<string>((subscriber) => {
    let buffer = '';
    const sub = stream.subscribe({
      next: (chunk) => {
        buffer += chunk;
        subscriber.next(chunk); // 继续把数据往外推
      },
      error: (err) => subscriber.error(err),
      complete: () => {
        // ===== AI生成结束，做一些操作 =====
        let htmlResult;
        if(type === CodeGenTypeEnum.HTML){
             htmlResult = CodeParser.parseHtmlCode(buffer);
             // ======== 保存到文件夹    ======================
             CodeFileSaver.saveHtmlCodeResult(htmlResult);
        }else if(type === CodeGenTypeEnum.MULTI_FILE){
            htmlResult = CodeParser.parseMultiFileCode(buffer);
            // ======== 保存到文件夹    ======================
            CodeFileSaver.saveMultiFileCodeResult(htmlResult);
        }
        subscriber.complete();
      },
    });


    return () => sub.unsubscribe();
  });
  }
}
