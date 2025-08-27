import { Injectable } from '@nestjs/common';
import { config } from '../config/config';
import { HtmlCodeResult } from '../common/enums/html-code-result.entity';
import { MultiFileCodeResult } from '../common/enums/multi-file-code-result.entity';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';

@Injectable()
export class AiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ 
      apiKey: config.apiKey,
      baseURL: config.baseUrl
     });
  }

  async generateHtmlCode(userMessage: string): Promise<HtmlCodeResult> {
    console.log('Generating HTML code for message:', userMessage);
    const prompt = await this.loadSystemPrompt('codegen-html-system-prompt.txt');
    const resp = await this.callAiModel(prompt + '\n' + userMessage);
    return this.parseHtmlCodeResult(resp);
  }

  async generateMultiFileCode(userMessage: string): Promise<MultiFileCodeResult> {
    const prompt = await this.loadSystemPrompt('codegen-multi-file-system-prompt.txt');
    const resp = await this.callAiModel(prompt + '\n' + userMessage);
    console.log('Raw multi-file code result:', resp);
    return this.parseMultiFileCodeResult(resp);
  }

  
  private async callAiModel(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: config.modelName || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '请严格按照要求输出完整 HTML 文件' },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
    });
    return response.choices[0].message?.content || '';
  }

  private async loadSystemPrompt(fileName: string): Promise<string> {
    return readFile(`./src/prompts/${fileName}`, 'utf-8');
  }

  private parseHtmlCodeResult(raw: string): HtmlCodeResult {
    try {
      return JSON.parse(raw);
    } catch {
      return { htmlCode: raw, description: '' };
    }
  }

  private parseMultiFileCodeResult(raw: string): MultiFileCodeResult {
    try {
      return JSON.parse(raw);
    } catch {
      return { htmlCode: raw, cssCode: '', jsCode: '', description: '' };
    }
  }
}
