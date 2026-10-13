import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core'
import { DatePipe, JsonPipe } from '@angular/common'
import { TranslocoModule } from '@ngneat/transloco'
import { ButtonModule } from 'primeng/button'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { AuditLogService, IAuditLog } from '../../common'

interface IChangeRow {
  field: string
  before: unknown
  after: unknown
}

/** Read-only view of one audit row: who, when, and a before/after table. */
@Component({
  selector: 'app-audit-log-detail',
  standalone: true,
  imports: [DatePipe, JsonPipe, TranslocoModule, ButtonModule],
  templateUrl: './audit-log-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogDetailComponent implements OnInit {
  private service = inject(AuditLogService)
  private config = inject(DynamicDialogConfig)
  readonly dialogRef = inject(DynamicDialogRef)

  readonly log = signal<IAuditLog | null>(null)
  readonly rows = signal<IChangeRow[]>([])
  readonly failed = signal(false)

  ngOnInit(): void {
    this.service.getById(this.config.data.id).subscribe({
      next: (log) => {
        this.log.set(log)
        const fields = new Set([...Object.keys(log.before ?? {}), ...Object.keys(log.after ?? {})])
        this.rows.set(
          [...fields].map((field) => ({
            field,
            before: log.before?.[field],
            after: log.after?.[field],
          })),
        )
      },
      error: () => this.failed.set(true),
    })
  }

  isObject(value: unknown): boolean {
    return value !== null && typeof value === 'object'
  }
}
