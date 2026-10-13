import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridComponent, IColumn } from 'app/shared/components/grid'
import { ITableFilterConfig, TableFilterComponent } from 'app/shared/components/table-filter'
import { BaseTableComponent } from 'app/shared/abstracts'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { CustomerGridService, ICustomer } from '../../common'
import { CustomerFormComponent } from '../customer-form/customer-form.component'

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, GridComponent, TableFilterComponent, ButtonModule],
  providers: [CustomerGridService, DialogService],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListComponent extends BaseTableComponent<ICustomer> {
  gridService = inject(CustomerGridService)
  formComponent = CustomerFormComponent
  showAddButton = false

  filterConfig: ITableFilterConfig = {
    columns: 3,
    showResetButton: true,
    fields: [
      { key: 'full_name', type: 'input', label: 'admin.customer.fields.full_name' },
      { key: 'phone', type: 'input', label: 'admin.customer.fields.phone' },
      { key: 'email', type: 'input', label: 'admin.customer.fields.email' },
    ],
  }

  columns: IColumn[] = [
    { field: 'full_name', header: 'admin.customer.fields.full_name' },
    { field: 'phone', header: 'admin.customer.fields.phone' },
    { field: 'email', header: 'admin.customer.fields.email' },
    { field: 'is_blocked', header: 'admin.customer.fields.is_blocked', template: 'boolean' },
    { field: 'last_login_at', header: 'admin.customer.fields.last_login_at', template: 'date' },
    { field: 'created_at', header: 'admin.common.createdAt', template: 'date' },
  ]

  protected getItemId(item: ICustomer): string | undefined {
    return item.id
  }

  protected getEditHeaderKey(): string {
    return 'admin.customer.edit'
  }

  protected getCreateHeaderKey(): string {
    return 'admin.customer.create'
  }
}
