import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridComponent, IColumn } from 'app/shared/components/grid'
import { ITableFilterConfig, TableFilterComponent } from 'app/shared/components/table-filter'
import { BaseTableComponent } from 'app/shared/abstracts'
import { PermissionService } from 'app/core/permission/permission.service'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { AdminRoleGridService, IAdminRole } from '../../common'
import { AdminRoleFormComponent } from '../admin-role-form/admin-role-form.component'

@Component({
  selector: 'app-admin-role-list',
  standalone: true,
  imports: [CommonModule, GridComponent, TableFilterComponent, ButtonModule],
  providers: [AdminRoleGridService, DialogService],
  templateUrl: './admin-role-list.component.html',
  styleUrls: ['./admin-role-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoleListComponent extends BaseTableComponent<IAdminRole> {
  gridService = inject(AdminRoleGridService)
  formComponent = AdminRoleFormComponent
  showAddButton = inject(PermissionService).hasAny('roles.manage')

  filterConfig: ITableFilterConfig = {
    columns: 1,
    showResetButton: true,
    fields: [{ key: 'name', type: 'input', label: 'admin.common.name' }],
  }

  columns: IColumn[] = [
    { field: 'name', header: 'admin.common.name', template: 'translate' },
    { field: 'description', header: 'admin.adminRole.fields.description' },
    { field: 'is_active', header: 'admin.common.isActive', template: 'boolean' },
    { field: 'updated_at', header: 'admin.common.updatedAt', template: 'date' },
  ]

  protected getItemId(item: IAdminRole): string | undefined {
    return item.id
  }

  protected getEditHeaderKey(): string {
    return 'admin.adminRole.edit'
  }

  protected getCreateHeaderKey(): string {
    return 'admin.adminRole.create'
  }
}
