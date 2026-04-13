import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription, SubscriptionStats } from '../../core/models/subscription.model';
import { MonthlySummaryComponent } from './components/monthly-summary/monthly-summary.component';
import { UpcomingRenewalsComponent } from './components/upcoming-renewals/upcoming-renewals.component';
import { SubscriptionCardComponent } from './components/subscription-card/subscription-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MonthlySummaryComponent,
    UpcomingRenewalsComponent,
    SubscriptionCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);

  // === Signals para estado reactivo ===
  subscriptions = signal<Subscription[]>([]);
  stats = signal<SubscriptionStats>({ totalMonthly: 0, count: 0, annualProjection: 0 });
  isLoading = signal(true);

  // === Computed signals ===
  activeSubscriptions = computed(() =>
    this.subscriptions().filter(s => s.status === 'active')
  );

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.subscriptionService.getAll().subscribe({
      next: (data) => this.subscriptions.set(data),
      error: (err) => console.error('Error cargando suscripciones:', err),
    });
    this.subscriptionService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error cargando estadisticas:', err),
      complete: () => this.isLoading.set(false),
    });
  }

  handleEdit(subscription: Subscription): void {
    this.router.navigate(['/subscriptions', subscription.id, 'edit']);
  }

  handleDelete(subscription: Subscription): void {
    // TODO: El candidato debe implementar la logica de eliminacion
    // con un dialogo de confirmacion y llamada al servicio
    console.log('TODO: Implementar eliminacion de', subscription.name);
  }
}
