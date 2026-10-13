import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridComponent, IColumn } from 'app/shared/components/grid'
import { ITableFilterConfig, TableFilterComponent } from 'app/shared/components/table-filter'
import { BaseTableComponent } from 'app/shared/abstracts'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { LanguageGridService, ILanguage } from '../../common'
import { LanguageFormComponent } from '../language-form/language-form.component'

@Component({
  selector: 'app-language-list',
  standalone: true,
  imports: [CommonModule, GridComponent, TableFilterComponent, ButtonModule],
  providers: [LanguageGridService, DialogService],
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageListComponent extends BaseTableComponent<ILanguage> {
  gridService = inject(LanguageGridService)
  formComponent = LanguageFormComponent
  showAddButton = true

  filterConfig: ITableFilterConfig = {
    columns: 2,
    showResetButton: true,
    fields: [
      { key: 'code', type: 'input', label: 'admin.language.fields.code' },
      { key: 'name', type: 'input', label: 'admin.language.fields.name' },
    ],
  }

  columns: IColumn[] = [
    { field: 'code', header: 'admin.language.fields.code' },
    { field: 'name', header: 'admin.common.name' },
    { field: 'native_name', header: 'admin.language.fields.native_name' },
    { field: 'is_default', header: 'admin.language.fields.is_default', template: 'boolean' },
    { field: 'is_active', header: 'admin.common.isActive', template: 'boolean' },
    { field: 'sort_order', header: 'admin.common.sortOrder' },
  ]

  protected getItemId(item: ILanguage): string | undefined {
    return item.id
  }

  protected getEditHeaderKey(): string {
    return 'admin.language.edit'
  }

  protected getCreateHeaderKey(): string {
    return 'admin.language.create'
  }
}
