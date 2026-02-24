import { SetMetadata } from '@nestjs/common';

export type SummaryMetadata = {
  name: string;
  description?: string;
};

export const SUMMARY_KEY = 'summary';

export const Summary = (name: string, description?: string) =>
  SetMetadata(SUMMARY_KEY, { name, description });
