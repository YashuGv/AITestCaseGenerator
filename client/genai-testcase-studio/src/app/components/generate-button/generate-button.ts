import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-generate-button',
  standalone: false,
  templateUrl: './generate-button.html',
  styleUrl: './generate-button.scss',
})
export class GenerateButton {
  @Input()  disabled = false;
  @Input()  loading  = false;
  @Output() generate = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) this.generate.emit();
  }
}
