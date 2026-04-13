import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Subscription } from '../../../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-card',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TitleCasePipe, UpperCasePipe],
  templateUrl: './subscription-card.component.html',
  styleUrl: './subscription-card.component.scss'
})
export class SubscriptionCardComponent {
  subscription = input.required<Subscription>();
  onEdit = output<Subscription>();
  onDelete = output<Subscription>();

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  edit(): void {
    this.menuOpen = false;
    this.onEdit.emit(this.subscription());
  }

  delete(): void {
    this.menuOpen = false;
    this.onDelete.emit(this.subscription());
  }
}
