import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { CreateNoteComponent } from './components/create-note/create-note.component';
import { EditNoteComponent } from './components/edit-note/edit-note.component';

const routes: Routes = [
  { path: '', component: NotesListComponent },
  { path: 'new', component: CreateNoteComponent },
  { path: ':id', component: EditNoteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class NotesModule {}
