import { Controller, Query, Sse } from '@nestjs/common';
import { AiCodeGeneratorFacade } from '../ai-code-generator.facade';
import { CodeGenTypeEnum } from '../common/enums/code-gen-type.enum';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Controller('ai')
export class AiController {
  constructor(private readonly facade: AiCodeGeneratorFacade) {}
  
  @Sse('generate-stream')
  generateCodeStream(
    @Query('message') message: string,
    @Query('type') type: CodeGenTypeEnum,
  ): Observable<{ data: string; event?: string }> {
    return this.facade.generateAndSaveCodeStream(message, type).pipe(
      map(chunk => ({ data: chunk })), // 普通代码片段
      finalize(() => {
        console.log('Code generation completed');
        // SSE 不支持直接在 finalize 推送，所以我们可以在 Observable 内推送特殊标记
      }),
    );
  }
}
