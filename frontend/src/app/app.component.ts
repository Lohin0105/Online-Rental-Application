import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent, FooterComponent],
    template: `
    <div class="app-container">
      <app-navbar />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
    styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .main-content {
      flex: 1;
      margin-top: 80px;
    }
  `]
})
export class AppComponent {}

