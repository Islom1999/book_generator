import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridComponent, IColumn } from 'app/shared/components/grid'
import { ITableFilterConfig, TableFilterComponent } from 'app/shared/components/table-filter'
import { BaseTableComponent } from 'app/shared/abstracts'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { RegionService } from '../../../region/common'
import { DistrictGridService, IDistrict } from '../../common'
import { pickTranslation } from 'app/shared/translatable/translatable'
import { DistrictFormComponent } from '../district-form/district-form.component'

@Component({
  selector: 'app-district-list',
  standalone: true,
  imports: [CommonModule, GridComponent, TableFilterComponent, ButtonModule],
  providers: [DistrictGridService, DialogService],
  templateUrl: './district-list.component.html',
  styleUrls: ['./district-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictListComponent extends BaseTableComponent<IDistrict> {
  gridService = inject(DistrictGridService)
  private regionOptions = inject(RegionService).selectOptions((region) =>
    pickTranslation(region.name, this.transloco.getActiveLang()),
  )
  formComponent = DistrictFormComponent
  showAddButton = true

  filterConfig: ITableFilterConfig = {
    columns: 2,
    showResetButton: true,
    fields: [
      { key: 'name', type: 'input', label: 'admin.district.fields.name' },
      {
        key: 'region_id',
        type: 'select',
        label: 'admin.district.fields.region_id',
        props: { options: this.regionOptions },
      },
    ],
  }

  columns: IColumn[] = [
    { field: 'name', header: 'admin.common.name', template: 'translate' },
    { field: 'region.name', header: 'admin.district.fields.region_name', template: 'translate' },
    { field: 'sort_order', header: 'admin.common.sortOrder' },
    { field: 'is_active', header: 'admin.common.isActive', template: 'boolean' },
  ]

  protected getItemId(item: IDistrict): string | undefined {
    return item.id
  }

  protected getEditHeaderKey(): string {
    return 'admin.district.edit'
  }

  protected getCreateHeaderKey(): string {
    return 'admin.district.create'
  }
}
