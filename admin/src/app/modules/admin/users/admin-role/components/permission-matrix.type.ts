import { AsyncPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { TranslocoModule } from '@ngneat/transloco'
import { FieldType, FieldTypeConfig } from '@ngx-formly/core'
import { Permission } from 'app/core/permission/permission.catalog'
import { PermissionService } from 'app/core/permission/permission.service'
import { CheckboxModule } from 'primeng/checkbox'
import { AdminRoleService } from '../common/services/admin-role.service'

/**
 * Formly type for a role's `permissions` (string[]): checkboxes grouped like
 * the API catalog, with a select-all per group. Keys the current admin does
 * not have are disabled, since the API refuses to grant them.
 */
@Component({
  selector: 'type-permission-matrix',
  standalone: true,
  imports: [AsyncPipe, FormsModule, TranslocoModule, CheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *transloco="let t">
      <div class="mb-2 text-sm font-medium">
        {{ t('admin.adminRole.fields.permissions') }}
        <span class="text-secondary">({{ selected().size }})</span>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        @for (group of (roles.catalog$ | async) ?? []; track group.group) {
          <fieldset class="rounded-md border p-3">
            <legend class="px-1">
              <label class="flex min-h-8 cursor-pointer items-center gap-2 font-medium">
                <p-checkbox
                  [binary]="true"
                  [ngModel]="allChecked(group.permissions)"
                  [indeterminate]="someChecked(group.permissions)"
                  [disabled]="disabled || !canGrantAny(group.permissions)"
                  (onChange)="toggleGroup(group.permissions, $event.checked)"
                  [ngModelOptions]="{ standalone: true }"
                />
                {{ t('permissionGroups.' + group.group) }}
              </label>
            </legend>
            @for (key of group.permissions; track key) {
              <label class="flex min-h-8 cursor-pointer items-center gap-2 text-sm">
                <p-checkbox
                  [binary]="true"
                  [ngModel]="selected().has(key)"
                  [disabled]="disabled || !canGrant(key)"
                  (onChange)="toggle(key, $event.checked)"
                  [ngModelOptions]="{ standalone: true }"
                />
                <span>{{ t('permissions.' + key) }}</span>
              </label>
            }
          </fieldset>
        }
      </div>
    </ng-container>
  `,
})
export class PermissionMatrixType extends FieldType<FieldTypeConfig> {
  readonly roles = inject(AdminRoleService)
  private access = inject(PermissionService)

  get disabled(): boolean {
    return !!this.props.disabled
  }

  selected(): Set<Permission> {
    return new Set<Permission>(this.formControl.value ?? [])
  }

  canGrant(key: Permission): boolean {
    return this.access.hasAny(key)
  }

  canGrantAny(keys: Permission[]): boolean {
    return keys.some((key) => this.canGrant(key))
  }

  allChecked(keys: Permission[]): boolean {
    const selected = this.selected()
    return keys.every((key) => selected.has(key))
  }

  someChecked(keys: Permission[]): boolean {
    const selected = this.selected()
    return !this.allChecked(keys) && keys.some((key) => selected.has(key))
  }

  toggle(key: Permission, checked: boolean): void {
    const selected = this.selected()
    if (checked) {
      selected.add(key)
    } else {
      selected.delete(key)
    }
    this.setValue(selected)
  }

  toggleGroup(keys: Permission[], checked: boolean): void {
    const selected = this.selected()
    for (const key of keys.filter((k) => this.canGrant(k))) {
      if (checked) {
        selected.add(key)
      } else {
        selected.delete(key)
      }
    }
    this.setValue(selected)
  }

  private setValue(selected: Set<Permission>): void {
    this.formControl.setValue([...selected])
    this.formControl.markAsDirty()
  }
}
