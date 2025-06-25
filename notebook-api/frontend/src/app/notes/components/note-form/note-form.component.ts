import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { NoteFormData } from '../../models/note-form.model';

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './note-form.component.html'
})

// A form for creating or editing notes.
export class NoteFormComponent implements OnInit {
  @Input() note?: Note;
  @Input() loading = false;
  @Output() submitForm = new EventEmitter<NoteFormData>();

  noteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.noteForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.note) {
      this.noteForm.patchValue(this.note);
    }
  }

  // Submits the form data to the parent component.
  onSubmit(): void {
    if (this.noteForm.valid) {
      const formData: NoteFormData = {
        title: this.noteForm.value.title || '',
        content: this.noteForm.value.content || ''
      };
      this.submitForm.emit(formData);
    }
  }
}