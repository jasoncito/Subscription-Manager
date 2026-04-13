import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SubscriptionStats } from '../../../../core/models/subscription.model';

@Component({
  selector: 'app-monthly-summary',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './monthly-summary.component.html',
  styleUrl: './monthly-summary.component.scss'
})
export class MonthlySummaryComponent {
  stats = input.required<SubscriptionStats>();
}
