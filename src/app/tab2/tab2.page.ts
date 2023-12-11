import { Component, inject } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Note } from '../model/note';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [ExploreContainerComponent, CommonModule, IonicModule]
})
export class Tab2Page {
  public noteS = inject(NoteService);

  private selectedNote: Note | null = null;

  constructor() {}

  ionViewDidEnter(){
    this.noteS.readAll()
  }

  editNote(){

  }

  removeNote(note: Note) {
    this.selectedNote = note;
    this.noteS.deleteNote(note)
      .then(() => {
        // Eliminación exitosa, realiza cualquier acción adicional si es necesario
      })
      .catch(error => {
        console.error('Error al eliminar la nota', error);
        // Manejar el error según sea necesario
      })
      .finally(() => {
        // Limpiar la nota seleccionada después de la eliminación (o manejarlo según sea necesario)
        this.selectedNote = null;
      });
  }

}