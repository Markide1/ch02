import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';
import { NoteFormData } from '../../models/note-form.model';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { NoteFormComponent } from '../note-form/note-form.component';

@Component({
  selector: 'app-edit-note',
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
        <h1 class="text-3xl font-bold text-gray-900">Edit Note</h1>
        <a routerLink="/notes" class="text-blue-600 hover:underline text-sm font-medium">
          Back to Notes
        </a>
      </div>

      <app-error-message *ngIf="error" [message]="error"></app-error-message>

      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <app-note-form
        *ngIf="note"
        [loading]="loading"
        [note]="note"
        (submitForm)="onSubmit($event)"
        class="mt-4"
      ></app-note-form>
    </div>
  `
})

// Component for editing an existing note.
export class EditNoteComponent implements OnInit {
  note: Note | null = null;
  error = '';
  loading = false;

  constructor(
    private notesService: NotesService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Note ID is missing';
      return;
    }
    this.loadNote(id);
  }

  private loadNote(id: string): void {
    this.loading = true;
    this.notesService.getNote(id).subscribe({
      next: (note) => {
        this.note = note;
        this.loading = false;
      },
      error: (error: string) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  // Handles the form submission for editing a note.
  onSubmit(formData: NoteFormData): void {
    if (!this.note?.id || !formData.title || !formData.content) {
      this.error = 'Title and content are required';
      return;
    }

    this.loading = true;
    this.error = '';

    this.notesService.updateNote(this.note.id, formData).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/notes']);
      },
      error: (error: string) => {
        this.error = error;
        this.loading = false;
      },
    });
  }
}
