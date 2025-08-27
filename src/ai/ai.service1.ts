import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { config } from '../config/config';
import { HtmlCodeResult } from '../common/enums/html-code-result.entity';
import { MultiFileCodeResult } from '../common/enums/multi-file-code-result.entity';

@Injectable()
export class AiService {

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

  private async callAiModel(prompt: string) {
    const resp = await axios.post(`${config.baseUrl}`, {
      model: config.modelName,
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: { 'Authorization': `Bearer ${config.apiKey}` }
    });
    return resp.data.choices[0].message.content;
  }


  private async loadSystemPrompt(fileName: string): Promise<string> {
    const fs = await import('fs/promises');
    return fs.readFile(`./src/prompts/${fileName}`, 'utf-8');
  }


  private parseHtmlCodeResult(raw: string): HtmlCodeResult {
    console.log('Raw HTML code result:', raw);
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
