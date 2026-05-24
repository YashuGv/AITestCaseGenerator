export type TestCaseType =
  | 'Functional'
  | 'Negative'
  | 'API'
  | 'Regression';

export type Priority = 'High' | 'Medium' | 'Low';

export interface TestCase {
  id:       string;
  title:    string;
  type:     TestCaseType;
  priority: Priority;
  steps:    string[];
  expected: string;
}

export interface GenerateRequest {
  outputType:   string;
  instructions: string;
}

export interface GenerateResponse {
  testCases:  TestCase[];
  confidence: number;
  totalCount: number;
}

export type GenerateStep = 'idle' | 'loading' | 'done' | 'error';