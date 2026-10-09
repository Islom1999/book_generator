import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GridComponent, IColumn } from 'app/shared/components/grid'
import { ITableFilterConfig, TableFilterComponent } from 'app/shared/components/table-filter'
import { BaseTableComponent } from 'app/shared/abstracts'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import { DistrictService } from '../../../district/common'
import { PostOfficeGridService, IPostOffice } from '../../common'
import { pickTranslation } from 'app/shared/translatable/translatable'
import { PostOfficeFormComponent } from '../post-office-form/post-office-form.component'

@Component({
  selector: 'app-post-office-list',
  standalone: true,
  imports: [CommonModule, GridComponent, TableFilterComponent, ButtonModule],
  providers: [PostOfficeGridService, DialogService],
  templateUrl: './post-office-list.component.html',
  styleUrls: ['./post-office-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostOfficeListComponent extends BaseTableComponent<IPostOffice> {
  gridService = inject(PostOfficeGridService)
  private districtOptions = inject(DistrictService).selectOptions((district) =>
    pickTranslation(district.name, this.transloco.getActiveLang()),
  )
  formComponent = PostOfficeFormComponent
  showAddButton = true

  filterConfig: ITableFilterConfig = {
    columns: 3,
    showResetButton: true,
    fields: [
      { key: 'postal_code', type: 'input', label: 'admin.postOffice.fields.postal_code' },
      { key: 'name', type: 'input', label: 'admin.postOffice.fields.name' },
      {
        key: 'district_id',
        type: 'select',
        label: 'admin.postOffice.fields.district_id',
        props: { options: this.districtOptions },
      },
    ],
  }

  columns: IColumn[] = [
    { field: 'postal_code', header: 'admin.postOffice.fields.postal_code' },
    { field: 'name', header: 'admin.common.name', template: 'translate' },
    {
      field: 'district.name',
      header: 'admin.postOffice.fields.district_name',
      template: 'translate',
    },
    { field: 'is_active', header: 'admin.common.isActive', template: 'boolean' },
  ]

  protected getItemId(item: IPostOffice): string | undefined {
    return item.id
  }

  protected getEditHeaderKey(): string {
    return 'admin.postOffice.edit'
  }

  protected getCreateHeaderKey(): string {
    return 'admin.postOffice.create'
  }
}
