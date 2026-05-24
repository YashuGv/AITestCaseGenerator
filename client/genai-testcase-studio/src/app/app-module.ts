import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { Header } from './components/header/header';
import { Upload }        from './components/upload/upload';
import { FilePreview }   from './components/file-preview/file-preview';
import { ConfigPanel }   from './components/config-panel/config-panel';
import { ProgressBar }   from './components/progress-bar/progress-bar';
import { EmptyState }    from './components/empty-state/empty-state';
import { SkeletonLoader } from './components/skeleton-loader/skeleton-loader';
import { TestCaseCard }  from './components/test-case-card/test-case-card';
import { OutputPreview } from './components/output-preview/output-preview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi  } from '@angular/common/http';
import { GenerateButton } from './components/generate-button/generate-button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    App,
    Header,
    Upload,
    FilePreview,
    ConfigPanel,
    GenerateButton,
    ProgressBar,
    EmptyState,
    SkeletonLoader,
    TestCaseCard,
    OutputPreview
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [App]
})
export class AppModule { }
