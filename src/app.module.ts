import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
const CODE_DEPLOY_ROOT_DIR = path.join(process.cwd(), 'tmp', 'code_deploy');
@Module({
  imports: [AiModule,ServeStaticModule.forRoot({
      rootPath: CODE_DEPLOY_ROOT_DIR,
      serveRoot: '/', // http://localhost/{deployKey}/index.html
    }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
