import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiCodeGeneratorFacade } from './ai-code-generator.facade';
@Module({
  controllers: [AiController],
  providers: [AiService, AiCodeGeneratorFacade],
  exports: [AiService, AiCodeGeneratorFacade], // ✅ 导出 AiService
})
export class AiModule {}
