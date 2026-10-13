import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { FormlyModule } from '@ngx-formly/core'
import { BaseFormComponent } from 'app/shared/abstracts'
import { FormActionButtonsComponent } from 'app/shared'
import { Observable } from 'rxjs'
import { ICustomer, CustomerService } from '../../common'

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormActionButtonsComponent],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerFormComponent extends BaseFormComponent<ICustomer> {
  private crudService = inject(CustomerService)
  readonly showDelete = false

  protected initFormFields(): void {
    this.fields = [
      {
        key: 'full_name',
        type: 'input',
        props: { label: 'admin.customer.fields.full_name', translate: true, required: true },
      },
      {
        key: 'is_blocked',
        type: 'checkbox',
        defaultValue: false,
        props: { label: 'admin.customer.fields.is_blocked', translate: true },
      },
    ]
  }

  protected getById(id: string, isArchiveView: boolean): Observable<ICustomer> {
    return this.crudService.getById(id, isArchiveView)
  }

  protected create(data: Partial<ICustomer>): Observable<ICustomer> {
    return this.crudService.create(data)
  }

  protected update(id: string, data: Partial<ICustomer>): Observable<ICustomer> {
    return this.crudService.update(id, data)
  }

  protected delete(id: string): Observable<ICustomer> {
    return this.crudService.delete(id)
  }

  protected mapToModel(data: ICustomer): Partial<ICustomer> {
    return { full_name: data.full_name, is_blocked: data.is_blocked } as Partial<ICustomer>
  }

  protected getDeleteTitle(): string {
    return 'admin.common.deleteTitle'
  }

  protected getDeleteMessage(): string {
    return String(this.model.full_name ?? '')
  }
}
