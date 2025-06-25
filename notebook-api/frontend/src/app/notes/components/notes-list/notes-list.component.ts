import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotesService } from '../../services/notes.service';
import { Note } from '../../models/note.model';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DeleteConfirmationComponent],
  templateUrl: './notes-list.component.html',
})

// A component that displays a list of notes with options to delete them.
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  loading = false;
  error = '';
  deleting = false;
  activeDeleteId: string | null = null;

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.loading = true;
    this.notesService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load notes';
        this.loading = false;
      },
    });
  }

  // Initiates the deletion of a note
  deleteNote(id: string): void {
    this.activeDeleteId = id;
  }

  confirmDelete(): void {
    if (!this.activeDeleteId) return;

    this.deleting = true;
    this.error = '';

    this.notesService.deleteNote(this.activeDeleteId).subscribe({
      next: () => {
        this.deleting = false;
        this.activeDeleteId = null;
        this.loadNotes();
      },
      error: () => {
        this.error = 'Failed to delete note';
        this.deleting = false;
        this.activeDeleteId = null;
      },
    });
  }

  // Cancels the deletion process
  cancelDelete(): void {
    this.activeDeleteId = null;
  }
}
