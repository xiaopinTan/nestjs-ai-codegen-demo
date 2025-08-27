// ai.service.ts
import { Injectable } from '@nestjs/common';
import { config } from '../config/config';
import { HtmlCodeResult } from '../common/enums/html-code-result.entity';
import { MultiFileCodeResult } from '../common/enums/multi-file-code-result.entity';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class AiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ 
      apiKey: config.apiKey,
      baseURL: config.baseUrl
    });
  }

  // --- 原来的同步调用保留 ---
  async generateHtmlCode(userMessage: string): Promise<HtmlCodeResult> {
    console.log('Generating HTML code for message:', userMessage);
    const prompt = await this.loadSystemPrompt('codegen-html-system-prompt.txt');
    console.log('Loaded HTML system prompt:', prompt);
    const resp = await this.callAiModel(prompt + '\n' + userMessage);
    console.log('AI model response for HTML code:', resp);
    return this.parseHtmlCodeResult(resp);
  }

  async generateMultiFileCode(userMessage: string): Promise<MultiFileCodeResult> {
    const prompt = await this.loadSystemPrompt('codegen-multi-file-system-prompt.txt');
    const resp = await this.callAiModel(prompt + '\n' + userMessage);
    return this.parseMultiFileCodeResult(resp);
  }

  // --- 新增：流式版本 ---
  generateHtmlCodeStream(userMessage: string): Observable<string> {
    return from(this.generateHtmlCode(userMessage)).pipe(
      map(result => result.htmlCode) // 只推送 HTML 代码内容
    );
  }

  generateMultiFileCodeStream(userMessage: string): Observable<string> {
    return from(this.generateMultiFileCode(userMessage)).pipe(
      map(result => JSON.stringify(result)) // 推送多文件结构
    );
  }

  // ----------------- 私有工具方法 -----------------
  private async callAiModel(prompt: string): Promise<string> {
    console.log('Calling AI model with prompt:', prompt);
    const response = await this.client.chat.completions.create({
      model: config.modelName || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '请严格按照要求输出完整 HTML 文件' },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
    });
    console.log('AI model raw response:', response.choices[0].message?.content);
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
