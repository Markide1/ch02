import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { NoteFormComponent } from '../note-form/note-form.component';
import { NoteFormData } from '../../models/note-form.model';

@Component({
  selector: 'app-create-note',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ErrorMessageComponent,
    NoteFormComponent
  ],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">Create New Note</h1>
        <a routerLink="/notes" class="text-blue-600 hover:underline text-sm font-medium">Back to Notes</a>
      </div>

      <app-error-message *ngIf="error" [message]="error"></app-error-message>

      <app-note-form
        [loading]="loading"
        (submitForm)="onSubmit($event)"
      ></app-note-form>
    </div>
  `
})

// Creating a new note.
export class CreateNoteComponent {
  error = '';
  loading = false;

  constructor(
    private notesService: NotesService,
    private router: Router
  ) { }

  onSubmit(formData: NoteFormData): void {
    if (!formData.title || !formData.content) {
      this.error = 'Title and content are required';
      return;
    }

    this.loading = true;
    this.error = '';

    this.notesService.createNote(formData).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/notes']);
      },
      error: (error: string) => {
        this.error = error;
        this.loading = false;
      }
    });
  }
}
