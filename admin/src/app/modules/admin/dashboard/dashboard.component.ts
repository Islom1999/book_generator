import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TranslocoPipe } from '@ngneat/transloco'

/** Placeholder until phase 1 adds order, revenue and AI-cost widgets. */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-2 p-6 sm:p-10">
      <h1 class="text-3xl font-extrabold tracking-tight">{{ 'nav.dashboard' | transloco }}</h1>
      <p class="text-secondary">{{ 'admin.dashboard.comingSoon' | transloco }}</p>
    </div>
  `,
})
export class DashboardComponent {}
