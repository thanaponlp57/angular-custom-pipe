import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PipeDocsPage } from '../features/pipe-docs/pipe-docs-page';

@Component({
  selector: 'app-root',
  imports: [PipeDocsPage],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
