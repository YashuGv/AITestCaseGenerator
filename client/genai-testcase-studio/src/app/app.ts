import { ChangeDetectorRef, Component, NgZone, signal } from '@angular/core';
import { GenerateStep, TestCase } from './models/test-case.model';
import { TestcaseService } from './services/testcase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  selectedFile:  File | null = null;
  outputType   = 'Functional Test Cases';
  instructions = '';

  step: GenerateStep = 'idle';
  progress    = 0;
  progressMsg = '';
  errorMsg    = '';

  testCases:  TestCase[] = [];
  confidence  = 0;

  private progressTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private testcaseSvc: TestcaseService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  /* ── File picked from UploadComponent ── */
  onFileSelected(file: File): void {
    this.selectedFile = file;
    this.resetOutput();
  }

  onFileRemoved(): void {
    this.selectedFile = null;
    this.resetOutput();
  }

  /* ── Config from ConfigPanelComponent ── */
  onOutputTypeChange(value: string): void  { this.outputType   = value; }
  onInstructionsChange(value: string): void { this.instructions = value; }

  /* ── Generate ── */
  onGenerate(): void {
    if (!this.selectedFile || this.step === 'loading') return;

    this.step     = 'loading';
    this.progress = 0;
    this.errorMsg = '';
    this.startFakeProgress();

    this.testcaseSvc
      .generate(this.selectedFile, this.outputType, this.instructions)
      .subscribe({
        next: (res) => {
          this.zone.run(() => {
            this.finishProgress();
            this.testCases  = res.testCases;
            this.confidence = res.confidence;
            this.step = 'done';
            this.cdr.detectChanges();
          });
        },
        error: (err: Error) => {
          this.zone.run(() => {
            this.finishProgress();
            this.errorMsg = err.message;
            this.step = 'error';
            this.cdr.detectChanges();
          });
        },
      });
  }

  /* ── Output actions ── */
  onClear(): void {
    this.resetOutput();
    this.step = 'idle';
  }

  onDownloadExcel(): void {
    if (!this.testCases.length) return;
    this.testcaseSvc.exportToExcel(this.testCases, this.outputType);
  }

  onCopyOutput(): void {
    const text = this.testCases
      .map((tc, i) =>
        `${tc.id}: ${tc.title}\nType: ${tc.type} | Priority: ${tc.priority}\n` +
        tc.steps.join('\n') + `\nExpected: ${tc.expected}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  }

  /* ── Helpers ── */
  get canGenerate(): boolean {
    return !!this.selectedFile && this.step !== 'loading';
  }

  private resetOutput(): void {
    this.testCases  = [];
    this.confidence = 0;
    this.errorMsg   = '';
  }

  private startFakeProgress(): void {
    const stages = [
      { pct: 15, msg: 'Reading document…'        },
      { pct: 35, msg: 'Extracting requirements…' },
      { pct: 60, msg: 'Building test cases…'     },
      { pct: 80, msg: 'Validating coverage…'     },
      { pct: 93, msg: 'Finalizing output…'       },
    ];
    let i = 0;
    this.zone.runOutsideAngular(() => {
      this.progressTimer = setInterval(() => {
        if (i < stages.length) {
          this.zone.run(() => {           
            this.progress    = stages[i].pct;
            this.progressMsg = stages[i].msg;
          });
          i++;
        }
      }, 550);
    });
  }

  private finishProgress(): void {
    if (this.progressTimer){
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
    this.progress    = 100;
    this.progressMsg = 'Done!';
  }
}
