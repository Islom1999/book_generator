import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridComponent, IColumn } from 'app/shared/components/grid'
import { ITableFilterConfig, TableFilterComponent } from 'app/shared/components/table-filter'
import { BaseTableComponent } from 'app/shared/abstracts'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { SettingGridService, ISetting } from '../../common'
import { SettingFormComponent } from '../setting-form/setting-form.component'

@Component({
  selector: 'app-setting-list',
  standalone: true,
  imports: [CommonModule, GridComponent, TableFilterComponent, ButtonModule],
  providers: [SettingGridService, DialogService],
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingListComponent extends BaseTableComponent<ISetting> {
  gridService = inject(SettingGridService)
  formComponent = SettingFormComponent
  showAddButton = true

  filterConfig: ITableFilterConfig = {
    columns: 1,
    showResetButton: true,
    fields: [{ key: 'key', type: 'input', label: 'admin.setting.fields.key' }],
  }

  columns: IColumn[] = [
    { field: 'key', header: 'admin.setting.fields.key' },
    { field: 'value', header: 'admin.setting.fields.value' },
    { field: 'description', header: 'admin.setting.fields.description' },
  ]

  protected getItemId(item: ISetting): string | undefined {
    return item.id
  }

  protected getEditHeaderKey(): string {
    return 'admin.setting.edit'
  }

  protected getCreateHeaderKey(): string {
    return 'admin.setting.create'
  }
}
