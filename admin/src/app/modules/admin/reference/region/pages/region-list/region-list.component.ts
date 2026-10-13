import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridComponent, IColumn } from 'app/shared/components/grid'
import { ITableFilterConfig, TableFilterComponent } from 'app/shared/components/table-filter'
import { BaseTableComponent } from 'app/shared/abstracts'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { RegionGridService, IRegion } from '../../common'
import { RegionFormComponent } from '../region-form/region-form.component'

@Component({
  selector: 'app-region-list',
  standalone: true,
  imports: [CommonModule, GridComponent, TableFilterComponent, ButtonModule],
  providers: [RegionGridService, DialogService],
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionListComponent extends BaseTableComponent<IRegion> {
  gridService = inject(RegionGridService)
  formComponent = RegionFormComponent
  showAddButton = true

  filterConfig: ITableFilterConfig = {
    columns: 1,
    showResetButton: true,
    fields: [{ key: 'name', type: 'input', label: 'admin.region.fields.name' }],
  }

  columns: IColumn[] = [
    { field: 'name', header: 'admin.common.name', template: 'translate' },
    { field: 'code', header: 'admin.region.fields.code' },
    { field: 'sort_order', header: 'admin.common.sortOrder' },
    { field: 'is_active', header: 'admin.common.isActive', template: 'boolean' },
  ]

  protected getItemId(item: IRegion): string | undefined {
    return item.id
  }

  protected getEditHeaderKey(): string {
    return 'admin.region.edit'
  }

  protected getCreateHeaderKey(): string {
    return 'admin.region.create'
  }
}
