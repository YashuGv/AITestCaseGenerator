import { Component, Input, Output, EventEmitter } from '@angular/core';

export const OUTPUT_TYPES = [
  'Functional Test Cases',
  'Negative Test Cases',
  'API Test Cases',
  'Regression Test Cases',
];

@Component({
  selector: 'app-config-panel',
  standalone: false,
  templateUrl: './config-panel.html',
  styleUrl: './config-panel.scss',
})
export class ConfigPanel {
  @Input()  outputType   = OUTPUT_TYPES[0];
  @Input()  instructions = '';

  @Output() outputTypeChange   = new EventEmitter<string>();
  @Output() instructionsChange = new EventEmitter<string>();

  readonly outputTypes = OUTPUT_TYPES;

  onTypeChange(e: Event): void {
    this.outputTypeChange.emit((e.target as HTMLSelectElement).value);
  }

  onInstructionsInput(e: Event): void {
    this.instructionsChange.emit((e.target as HTMLTextAreaElement).value);
  }
}
