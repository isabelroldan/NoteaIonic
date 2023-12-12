import { Component, inject } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
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

  constructor(private alertController: AlertController) {}

  ionViewDidEnter(){
    this.noteS.readAll()
  }

  async presentAlert(note: any) {
    const alert = await this.alertController.create({
      header: 'Detalles de la Nota',
      subHeader: 'A Sub Header Is Optional',
      message: `
        <div class="alert-message">
          <div>
            ${note.title}
          </div>
          <div *ngIf='note.description'>
            Descripción: ${note.description}
          </div>
          <div>
            Fecha: ${note.date}
          </div>
          <div *ngIf='note.img'>
            <img src='${note.img}' alt='Imagen de la nota'>
          </div>
          <div *ngIf='note.position'>
            Latitud: ${note.position?.latitude} | Longitud: ${note.position?.longitude}
          </div>
        </div>
      `,
      buttons: ['OK']
    });

    // Obtén el elemento del mensaje
    const messageElement = await alert.querySelector('.alert-message');

    // Verifica si el elemento existe y no es nulo antes de manipularlo
    if (messageElement && messageElement.textContent !== null) {
      // Establece el HTML del mensaje
      messageElement.innerHTML = messageElement.textContent;
    }

    await alert.present();
  }



  editNote(){

  }

  /*removeNote(note: Note) {
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
  }*/

  async removeNote(note: Note) {
    const alert = await this.alertController.create({
      header: 'Eliminar nota',
      message: `¿Estás seguro que quieres eliminar la nota llamada "${note.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Acción cuando se pulsa cancelar (puedes dejarlo vacío o manejar según necesites)
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.noteS.deleteNote(note)
              .then(() => {
                // Eliminación exitosa, realiza cualquier acción adicional si es necesario
              })
              .catch(error => {
                console.error('Error al eliminar la nota', error);
                // Manejar el error según sea necesario
              });
          }
        }
      ]
    });

    await alert.present();
  }


}