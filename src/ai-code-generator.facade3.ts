// ai-code-generator.facade.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AiService } from './ai/ai.service';
import { CodeGenTypeEnum } from './common/enums/code-gen-type.enum';

@Injectable()
export class AiCodeGeneratorFacade {
  constructor(private readonly aiService: AiService) {}

  generateAndSaveCodeStream(
    userMessage: string,
    type: CodeGenTypeEnum,
  ): Observable<string> {
    console.log(`Generating code stream of type ${type} for message: ${userMessage}`);
    if (!type) {
      throw new InternalServerErrorException('生成类型为空');
    }
    console.log(`Processing generation for type: ${type}`);
    switch (type) {
      case CodeGenTypeEnum.HTML: {
        const codeStream = this.aiService.generateHtmlCodeStream(userMessage);
        return this.processCodeStream(codeStream, type);
      }
      case CodeGenTypeEnum.MULTI_FILE: {
        const codeStream = this.aiService.generateMultiFileCodeStream(userMessage);
        return this.processCodeStream(codeStream, type);
      }
      default:
        throw new InternalServerErrorException(`不支持的生成类型: ${type}`);
    }
  }

  private processCodeStream(stream: Observable<string>, type: CodeGenTypeEnum): Observable<string> {
    // 可在这里保存数据库或加日志
    return stream;
  }
}
