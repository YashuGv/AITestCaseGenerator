import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-preview',
  standalone: false,
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.scss',
})
export class FilePreview {
   @Input()  file!: File;
  @Output() fileRemoved = new EventEmitter<void>();

  displayName = '';
  displaySize = '';
  iconColor   = 'from-blue-500 to-blue-700';

  ngOnInit(): void {
    this.displayName = this.file.name;
    this.displaySize = this.formatSize(this.file.size);
    this.iconColor   = this.colorForType(this.file.name);
  }

  remove(): void {
    this.fileRemoved.emit();
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024)        return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  private colorForType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf')  return 'from-red-500 to-red-700';
    if (ext === 'docx') return 'from-blue-500 to-blue-700';
    return 'from-slate-500 to-slate-700';
  }

  get fileExtLabel(): string {
    return (this.file.name.split('.').pop() ?? '').toUpperCase();
  }
}
