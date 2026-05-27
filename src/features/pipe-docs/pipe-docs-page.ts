import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PIPE_DOCS } from './data-access/pipe-docs.data';
import { TopBar } from './components/top-bar/top-bar';
import { PipeHeader } from './components/pipe-header/pipe-header';
import { SyntaxBar } from './components/syntax-bar/syntax-bar';
import { ParamsTable } from './components/params-table/params-table';
import { SectionLabel } from './components/section-label/section-label';
import { PipePlayground } from './components/pipe-playground/pipe-playground';
import { CodeBlock } from './components/code-block/code-block';
import { NotesBlock } from './components/notes-block/notes-block';
import { DocsPager } from './components/docs-pager/docs-pager';

@Component({
  selector: 'app-pipe-docs-page',
  imports: [
    TopBar,
    PipeHeader,
    SyntaxBar,
    ParamsTable,
    SectionLabel,
    PipePlayground,
    CodeBlock,
    NotesBlock,
    DocsPager,
  ],
  templateUrl: './pipe-docs-page.html',
  styleUrl: './pipe-docs-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipeDocsPage {
  protected readonly docs = PIPE_DOCS;
  protected readonly total = PIPE_DOCS.length;
  protected readonly activeIndex = signal(0);
  protected readonly doc = computed(() => this.docs[this.activeIndex()]);
  protected readonly prevLabel = computed(() => this.docs[this.activeIndex() - 1]?.name ?? null);
  protected readonly nextLabel = computed(() => this.docs[this.activeIndex() + 1]?.name ?? null);

  /** ไปยัง pipe ตาม index โดยจำกัดให้อยู่ในช่วงที่มีจริง */
  protected goTo(index: number): void {
    const lastIndex = this.total - 1;
    const safeIndex = Math.min(Math.max(index, 0), lastIndex);
    this.activeIndex.set(safeIndex);
  }
}
