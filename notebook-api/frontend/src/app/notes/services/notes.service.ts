import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Note } from '../models/note.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { ApiError } from '../../core/models/api-error.model';

@Injectable({
  providedIn: 'root',
})

// A service for managing notes, including CRUD operations.
export class NotesService {
  private apiUrl = `${environment.apiUrl}/notes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  // Method to handle errors from API calls
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this.authService.logout();
      return throwError(() => 'Please log in again');
    }

    console.error('API Error:', error);

    const apiError = error.error as ApiError;
    if (apiError?.message) {
      return throwError(() => apiError.message);
    }

    return throwError(() => 'Failed to process request');
  }

  // Methopd to get all notes
  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl, this.getHeaders()).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Get notes error:', error);
        return throwError(() => 'Failed to load notes');
      }),
    );
  }

  // Method to get a single note by ID
  getNote(id: string): Observable<Note> {
    if (!id || id === 'null' || id === 'undefined' || id === 'NaN') {
      return throwError(() => new Error('Invalid note ID'));
    }
    
    return this.http
      .get<Note>(`${this.apiUrl}/${id}`, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  // Methods to create note
  createNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note, this.getHeaders()).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.message) {
  
          return throwError(() => error.error.message);
        }
        return throwError(() => 'Failed to create note');
      }),
    );
  }

  // Method to update a note
  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    if (!id || id === 'null' || id === 'undefined' || id === 'NaN') {
      return throwError(() => new Error('Invalid note ID'));
    }

    return this.http
      .patch<Note>(`${this.apiUrl}/${id}`, note, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  // Method to delete a note
  deleteNote(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, this.getHeaders())
      .pipe(catchError(this.handleError));
  }
}
