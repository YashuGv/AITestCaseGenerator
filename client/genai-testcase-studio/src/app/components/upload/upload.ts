import { Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

const ACCEPTED = ['application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'];
const ACCEPTED_EXT = ['.pdf', '.docx', '.txt'];

@Component({
  selector: 'app-upload',
  standalone: false,
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class Upload {
  @Output() fileSelected = new EventEmitter<File>();

  isDragOver = false;
  errorMsg   = '';

  constructor(private el: ElementRef) {}

  @HostListener('dragover', ['$event'])
  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(e: DragEvent): void {
    if (!this.el.nativeElement.contains(e.relatedTarget)) {
      this.isDragOver = false;
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file) this.validate(file);
  }

  onBrowse(input: HTMLInputElement): void {
    input.click();
  }

  onFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (file) this.validate(file);
    input.value = '';        // reset so same file can be re-selected
  }

  private validate(file: File): void {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_EXT.includes(ext)) {
      this.errorMsg = `Unsupported file type. Please upload ${ACCEPTED_EXT.join(', ')}.`;
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.errorMsg = 'File size must be under 10 MB.';
      return;
    }
    this.errorMsg = '';
    this.fileSelected.emit(file);
  }
}
