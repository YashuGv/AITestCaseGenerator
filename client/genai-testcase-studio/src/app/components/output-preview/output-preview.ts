import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { GenerateStep, TestCase } from '../../models/test-case.model';

@Component({
  selector: 'app-output-preview',
  standalone: false,
  templateUrl: './output-preview.html',
  styleUrl: './output-preview.scss',
})
export class OutputPreview {
  @Input() step:       GenerateStep = 'idle';
  @Input() testCases:  TestCase[]   = [];
  @Input() confidence  = 0;
  @Input() outputType  = '';

  @Output() clear         = new EventEmitter<void>();
  @Output() downloadExcel = new EventEmitter<void>();
  @Output() copyOutput    = new EventEmitter<void>();

  constructor(private el: ElementRef) {}
  get outputTypeLabel(): string {
    return this.outputType.replace(' Test Cases', '');
  }

  getTypeBadge(type: string): string {
    const map: Record<string, string> = {
      'Functional': 'bg-blue-50 text-blue-700 border-blue-100',
      'Negative':   'bg-red-50 text-red-700 border-red-100',
      'API':        'bg-purple-50 text-purple-700 border-purple-100',
      'Regression': 'bg-amber-50 text-amber-700 border-amber-100',
    };
    return map[type] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  }

  getPriorityBadge(priority: string): string {
    const map: Record<string, string> = {
      'High':   'bg-rose-50 text-rose-700 border-rose-100',
      'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'Low':    'bg-green-50 text-green-700 border-green-100',
    };
    return map[priority] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  }

  selectTable(): void {
    const table = this.el.nativeElement.querySelector('#testCaseTable');
    if (!table) return;
    const range = document.createRange();
    range.selectNode(table);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}
