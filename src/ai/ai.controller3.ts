// ai.controller.ts
import { Controller, Query, Sse } from '@nestjs/common';
import { AiCodeGeneratorFacade } from '../ai-code-generator.facade';
import { CodeGenTypeEnum } from '../common/enums/code-gen-type.enum';
import { map } from 'rxjs';

@Controller('ai')
export class AiController {
  constructor(private readonly facade: AiCodeGeneratorFacade) {}

  @Sse('generate-stream')
  generateCodeStream(
    @Query('message') message: string,
    @Query('type') type: CodeGenTypeEnum,
  ) {
    console.log(`Received request to generate code stream of type ${type} with message: ${message}`);
    return this.facade
      .generateAndSaveCodeStream(message, type)
      .pipe(map(chunk => ({ data: chunk }))); // SSE 格式
  }
}
