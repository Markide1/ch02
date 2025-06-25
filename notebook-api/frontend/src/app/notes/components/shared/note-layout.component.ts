import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-note-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
        <a
          routerLink="/notes"
          class="text-blue-600 hover:underline text-sm font-medium"
          >Back to Notes</a
        >
      </div>

      <div
        *ngIf="error"
        class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center"
      >
        <svg
          class="w-5 h-5 mr-2 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.414-1.414M5.636 5.636l1.414 1.414M17.657 17.657l1.414-1.414M12 8v4m0 4h.01"
          ></path>
        </svg>
        <span>{{ error }}</span>
      </div>

      <ng-content></ng-content>
    </div>
  `,
})

// A layout component for notes
export class NoteLayoutComponent {
  @Input() title = '';
  @Input() error = '';
}
