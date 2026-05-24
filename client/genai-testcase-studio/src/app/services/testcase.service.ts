import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GenerateResponse, TestCase } from '../models/test-case.model';
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class TestcaseService {

  private readonly apiUrl = 'https://localhost:7230/api/TestCases/generate';

  constructor(private http: HttpClient) {}

  generate(file: File, outputType: string, instructions: string): Observable<GenerateResponse> {
    const formData = new FormData();
    formData.append('file',         file);
    formData.append('outputType',   outputType);
    formData.append('instructions', instructions);

    return this.http
      .post<GenerateResponse>(this.apiUrl, formData)
      .pipe(catchError(this.handleError));
  }

  exportToExcel(testCases: TestCase[], outputType: string): void {
    // 1. Map each test case to a flat row object
    const rows = testCases.map((tc, index) => ({
      '#':              index + 1,
      'Test ID':        tc.id,
      'Title':          tc.title,
      'Type':           tc.type,
      'Priority':       tc.priority,
      'Steps':          tc.steps.join('\n'),   // newline-separated in one cell
      'Expected Result': tc.expected,
    }));

    // 2. Create worksheet from the rows
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // 3. Set column widths
    worksheet['!cols'] = [
      { wch: 5  },   // #
      { wch: 12 },   // Test ID
      { wch: 45 },   // Title
      { wch: 14 },   // Type
      { wch: 10 },   // Priority
      { wch: 60 },   // Steps
      { wch: 50 },   // Expected Result
    ];

    // 4. Enable wrap text on every cell so steps show on multiple lines
    const range = XLSX.utils.decode_range(worksheet['!ref'] ?? 'A1');
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;
        if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};
        worksheet[cellAddress].s.alignment = { wrapText: true, vertical: 'top' };
      }
    }

    // 5. Create workbook and append sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Cases');

    // 6. Build filename from output type + timestamp
    const label     = outputType.replace(' Test Cases', '').replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10);   // e.g. 2026-05-24
    const filename  = `TestCases_${label}_${timestamp}.xlsx`;

    // 7. Trigger browser download
    XLSX.writeFile(workbook, filename);
  }


  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let message = 'An unexpected error occurred.';
    if (error.status === 0) {
      message = 'Cannot reach the server. Is the API running?';
    } else if (error.status === 400) {
      message = error.error?.message ?? 'Invalid request.';
    } else if (error.status === 500) {
      message = 'Server error. Please try again.';
    } else if (error.status === 413) {
      message = 'File is too large. Please upload a smaller document.';
    } else if (error.status === 415) {
      message = 'Unsupported file type. Please upload PDF, DOCX, or TXT.';
    }
    return throwError(() => new Error(message));
  }
}