import { Component, signal, computed, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, BottomNavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private platformId = inject(PLATFORM_ID);
  windowWidth = signal(this.getWindowWidth());
  isDesktop = computed(() => this.windowWidth() >= 768);

  @HostListener('window:resize')
  onResize(): void {
    this.windowWidth.set(this.getWindowWidth());
  }

  private getWindowWidth(): number {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth;
    }
    return 1024;
  }
}
