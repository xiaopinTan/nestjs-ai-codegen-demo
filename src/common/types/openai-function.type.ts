export type OpenAIFunction = {
  type?: string;
  properties: Record<string, unknown>;
  required?: string[];
  description?: string;
};