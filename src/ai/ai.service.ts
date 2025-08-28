import { Injectable } from '@nestjs/common';
import { config } from '../config/config';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import { Observable } from 'rxjs';
import { OpenAIFunction } from "../common/types/openai-function.type"

@Injectable()
export class AiService {
  private client: OpenAI;
  constructor() {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
  }

  // ----------------- HTML 流式生成 -----------------
  generateHtmlCodeStream(userMessage: string): Observable<string> {
   return this.generateStream({
      promptFile: 'codegen-html-system-prompt.txt',
      systemRole: '请严格按照要求输出完整 HTML 文件',
      functionDef: [
        {
        name: 'generate_single_page_website',
        description:
          '根据用户提供的网站描述，生成完整独立的 HTML 单页面网站，包含 HTML、CSS 和原生 JavaScript。',
        parameters: {
          type: 'json_object',
          properties: {
            html: {
              type: 'string',
              description:
                '完整的 HTML 文档内容，包含 <html>、<head>、<body> 标签，满足响应式设计要求',
            },
            css: {
              type: 'string',
              description:
                '内联在 <style> 标签中的 CSS 样式，禁止外部依赖，使用 Flexbox 或 Grid 布局实现响应式',
            },
            js: {
              type: 'string',
              description:
                '内联在 <script> 标签中的 JavaScript 代码，实现用户要求的交互功能（如轮播图、Tab 切换、表单提示）',
            },
          },
          required: ['html', 'css', 'js'],
        },
      }
      ],
      userMessage
    });
  }

  // ----------------- 多文件流式生成 -----------------
  generateMultiFileCodeStream(userMessage: string): Observable<string> {
    return this.generateStream({
      promptFile: 'codegen-multi-file-system-prompt.txt',
      systemRole: '请输出 JSON 格式，包含 htmlCode/cssCode/jsCode/description',
      functionDef: [{
        name: 'generate_separated_single_page_website',
        description:
          '根据用户提供的网站描述生成完整单页网站，将 HTML、CSS、JS 分别放入三个独立的文件。',
        parameters: {
          type: 'json_object',
          properties: {
            html: {
              type: 'string',
              description:
                'index.html 文件内容，包含网页结构和内容。在 <head> 中通过 <link> 标签引用 style.css，在 </body> 结束标签前通过 <script> 标签引用 script.js。只包含 HTML 结构，不包含 CSS 或 JS 逻辑。',
            },
            css: {
              type: 'string',
              description:
                'style.css 文件内容，包含网站所有样式规则。必须响应式，支持桌面和移动设备布局。禁止使用任何外部框架或字体库，优先使用 Flexbox 或 Grid 布局。',
            },
            js: {
              type: 'string',
              description:
                'script.js 文件内容，包含网站所有交互逻辑。必须使用原生 JavaScript 实现用户要求的交互功能，如轮播图、Tab 切换、表单提交提示等，不允许使用任何外部库。',
            },
          },
          required: ['html', 'css', 'js'],
        },
      }],
      userMessage
    })
  }

  // ----------------- 私有工具方法 -----------------
  private generateStream({
    promptFile,
    systemRole,
    functionDef,
    userMessage,
  }: {
    promptFile: string;
    systemRole: string;
    functionDef: [{
      name: string;
      description: string;
      parameters: OpenAIFunction;
    }];
    userMessage: string;
  }): Observable<string> {
    return new Observable<string>((subscriber) => {
      (async () => {
        try {
          const prompt = await this.loadSystemPrompt(promptFile);

          const stream = await this.client.chat.completions.create({
            model: config.modelName || 'gpt-3.5-turbo',
            stream: true,
            messages: [
              {
                role: 'system',
                content: systemRole,
              },
              { role: 'user', content: prompt + '\n' + userMessage },
            ],
            temperature: 0,
            response_format: { type: 'json_object' },
            functions: functionDef
            ,
          });
          for await (const part of stream) {
            const delta = part.choices[0]?.delta?.content;
            if (delta) {
              subscriber.next(delta);
            }
          }
          subscriber.complete();
        } catch (err) {
          subscriber.error(err);
        }
      })();
    });
  }

  private async loadSystemPrompt(fileName: string): Promise<string> {
    return readFile(`./src/prompts/${fileName}`, 'utf-8');
  }
}
