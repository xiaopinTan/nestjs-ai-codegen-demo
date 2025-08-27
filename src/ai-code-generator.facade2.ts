// import { Injectable } from '@nestjs/common';
// import { AiService } from './ai/ai.service';
// import { CodeFileSaver } from './core/code-file-saver';
// import { CodeGenTypeEnum } from './common/enums/code-gen-type.enum';

// @Injectable()
// export class AiCodeGeneratorFacade {
//   constructor(private readonly aiService: AiService) {}

  
//   async generateAndSaveCode(userMessage: string, type: CodeGenTypeEnum): Promise<string> {
//     console.log(`Generating and saving code of type ${type} for message: ${userMessage}`);
//     switch (type) {
//       case CodeGenTypeEnum.HTML:
//         const html = await this.aiService.generateHtmlCode(userMessage);
//         return CodeFileSaver.saveHtmlCodeResult(html);
//       case CodeGenTypeEnum.MULTI_FILE:
//         const multi = await this.aiService.generateMultiFileCode(userMessage);
//         return CodeFileSaver.saveMultiFileCodeResult(multi);
//       default:
//         throw new Error(`不支持的生成类型: ${type}`);
//     }
//   }
// }
