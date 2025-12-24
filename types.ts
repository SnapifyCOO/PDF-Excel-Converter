
export interface SheetData {
  name: string;
  rows: any[][];
}

export interface ConversionResponse {
  sheets: SheetData[];
}

export interface FileState {
  file: File;
  preview: string;
  type: string;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
