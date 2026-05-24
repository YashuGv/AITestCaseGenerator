import { Component, Input } from '@angular/core';
import { TestCase } from '../../models/test-case.model';

@Component({
  selector: 'app-test-case-card',
  standalone: false,
  templateUrl: './test-case-card.html',
  styleUrl: './test-case-card.scss',
})
export class TestCaseCard {
  @Input() testCase!: TestCase;
  @Input() index     = 0;

  get typeBadgeClass(): string {
    const map: Record<string, string> = {
      'Functional': 'bg-blue-50 text-blue-700 border-blue-100',
      'Negative':   'bg-red-50  text-red-700  border-red-100',
      'API':        'bg-purple-50 text-purple-700 border-purple-100',
      'Regression': 'bg-amber-50 text-amber-700 border-amber-100',
    };
    return map[this.testCase.type] ?? 'bg-slate-100 text-slate-700';
  }

  get priorityBadgeClass(): string {
    const map: Record<string, string> = {
      'High':   'bg-rose-50 text-rose-700 border-rose-100',
      'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-100',
      'Low':    'bg-green-50 text-green-700 border-green-100',
    };
    return map[this.testCase.priority] ?? 'bg-slate-100 text-slate-700';
  }
}
