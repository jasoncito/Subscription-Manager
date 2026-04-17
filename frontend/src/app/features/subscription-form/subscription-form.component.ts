import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionService } from '../../core/services/subscription.service';
import { CATEGORIES } from '../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss'
})
export class SubscriptionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  isLoading = signal(false);
  editId = signal<number | null>(null);

  categories = CATEGORIES;

  form = this.fb.group({
    name:            ['', [Validators.required, Validators.minLength(2)]],
    price:           [null as number | null, [Validators.required, Validators.min(0.01)]],
    billingCycle:    ['monthly' as 'monthly' | 'annual'],
    category:        ['entertainment' as 'entertainment' | 'software' | 'utilities' | 'lifestyle', Validators.required],
    nextPaymentDate: ['', Validators.required],
    color:           ['#0056D2'],
    icon:            ['star'],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editId.set(Number(id));
      this.isLoading.set(true);
      this.subscriptionService.getById(Number(id)).subscribe({
        next: (data) => {
          this.form.patchValue({
            ...data,
            nextPaymentDate: data.nextPaymentDate.slice(0, 10),
          });
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error cargando suscripcion:', err);
          this.isLoading.set(false);
        },
      });
    }
  }

  setBillingCycle(cycle: 'monthly' | 'annual'): void {
    this.form.patchValue({ billingCycle: cycle });
  }

  selectCategory(cat: typeof CATEGORIES[number]): void {
    this.form.patchValue({ category: cat.value, icon: cat.icon });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as any;
    if (this.isEditMode()) {
      this.subscriptionService.update(this.editId()!, value).subscribe({
        next: () => this.router.navigate(['/subscriptions']),
        error: (err) => console.error('Error actualizando:', err),
      });
    } else {
      this.subscriptionService.create(value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error('Error creando:', err),
      });
    }
  }

  onCancel(): void {
    this.router.navigate([this.isEditMode() ? '/subscriptions' : '/dashboard']);
  }
}
