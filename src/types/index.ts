export type TextInput = {
  label: string;
  variable: string;
  required: boolean;
  max_length: number;
  default: string;
};

export type Select = {
  label: string;
  variable: string;
  required: boolean;
  options: string[];
  default: string;
};

export type FormItem = {
  type: string;
  label: string;
  variable: string;
  required: boolean;
  max_length?: number;
  default: string;
  options?: string[];
};
export type DifyStreamResponse = {
  data: NodeJS.ReadableStream;
};
