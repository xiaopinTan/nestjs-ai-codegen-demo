// import { Controller, Post, Body } from '@nestjs/common';
// import { AiCodeGeneratorFacade } from '../ai-code-generator.facade';
// import { CodeGenTypeEnum } from '../common/enums/code-gen-type.enum';

// @Controller('ai')
// export class AiController {
//   constructor(private readonly facade: AiCodeGeneratorFacade) {}

//   @Post('generate')
//   async generateCode(
//     @Body('message') message: string,
//     @Body('type') type: CodeGenTypeEnum,
//   ) {
//     console.log(`Received request to generate code of type ${type} with message: ${message}`);
//     const path = await this.facade.generateAndSaveCode(message, type);
//     return { path };
//   }
// }
