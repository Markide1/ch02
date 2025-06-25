import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-black/20 z-40 flex items-center justify-center"
      *ngIf="isVisible"
      (click)="onCancel()"
    >
      <div
        class="w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4 transform transition-all duration-200"
        [class.opacity-0]="!isVisible"
        [class.opacity-100]="isVisible"
        [class.scale-95]="!isVisible"
        [class.scale-100]="isVisible"
        *ngIf="isVisible"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-start mb-3">
          <div class="flex-shrink-0">
            <svg
              class="h-6 w-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900">Delete Note</h3>
            <p class="text-sm text-gray-500 mt-1">
              Are you sure you want to delete this note?
            </p>
          </div>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            (click)="onCancel()"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            (click)="onConfirm()"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        position: static;
      }
    `,
  ],
})

// Delete dialog that confirms the deletion of a note.
export class DeleteConfirmationComponent {
  @Input() isVisible = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
