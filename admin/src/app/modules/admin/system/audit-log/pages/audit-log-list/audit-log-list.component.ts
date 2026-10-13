import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridComponent, IColumn } from 'app/shared/components/grid'
import { ITableFilterConfig, TableFilterComponent } from 'app/shared/components/table-filter'
import { BaseTableComponent } from 'app/shared/abstracts'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { AuditLogGridService, IAuditLog } from '../../common'
import { AuditLogDetailComponent } from '../audit-log-detail/audit-log-detail.component'

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [CommonModule, GridComponent, TableFilterComponent, ButtonModule],
  providers: [AuditLogGridService, DialogService],
  templateUrl: './audit-log-list.component.html',
  styleUrls: ['./audit-log-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogListComponent extends BaseTableComponent<IAuditLog> {
  gridService = inject(AuditLogGridService)
  formComponent = AuditLogDetailComponent
  showAddButton = false

  filterConfig: ITableFilterConfig = {
    columns: 3,
    showResetButton: true,
    fields: [
      { key: 'entity', type: 'input', label: 'admin.auditLog.fields.entity' },
      { key: 'action', type: 'input', label: 'admin.auditLog.fields.action' },
      { key: 'entity_id', type: 'input', label: 'admin.auditLog.fields.entity_id' },
    ],
  }

  columns: IColumn[] = [
    { field: 'created_at', header: 'admin.auditLog.fields.created_at', template: 'date' },
    { field: 'admin.email', header: 'admin.auditLog.fields.admin' },
    { field: 'action', header: 'admin.auditLog.fields.action' },
    { field: 'entity', header: 'admin.auditLog.fields.entity' },
    { field: 'entity_id', header: 'admin.auditLog.fields.entity_id' },
  ]

  protected getItemId(item: IAuditLog): string | undefined {
    return item.id
  }

  protected getEditHeaderKey(): string {
    return 'admin.auditLog.detail'
  }

  protected getCreateHeaderKey(): string {
    return 'admin.auditLog.detail'
  }
}
