import { Component, inject } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { Note } from '../model/note';
import * as L from 'leaflet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Capacitor } from '@capacitor/core';

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

  editForm: FormGroup;

  constructor(private alertController: AlertController, private formBuilder: FormBuilder) {
    // Inicializa el formulario con los campos que deseas editar
    this.editForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      img: [''],
      position: this.formBuilder.group({
        latitude: [''],
        longitude: ['']
      }),
      date: ['']
    });
  }

  ionViewDidEnter() {
    this.noteS.readAll()
  }

  /*async presentAlert(note: any) {
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
            <div id="map" style="height: 200px;"></div>
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
  
    // Obtén el elemento del mapa
    const mapElement = document.getElementById('map');
  
    if (mapElement && note.position) {
      // Crea un mapa Leaflet
      const map = L.map(mapElement).setView([note.position.latitude, note.position.longitude], 13);
  
      // Añade una capa de mosaico (puedes ajustar la URL del mosaico según tus necesidades)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
  
      // Añade un marcador en la ubicación
      L.marker([note.position.latitude, note.position.longitude]).addTo(map);
    }
  }*/


  initializeMap(noteKey: string, latitude: number, longitude: number) {
    // Obtén el elemento del mapa específico para esta nota
    const mapElement = document.getElementById(`map-${noteKey}`);
  
    // Verifica si el mapa ya existe antes de inicializarlo
    if (mapElement && !mapElement.hasChildNodes()) {
      const map = L.map(mapElement).setView([latitude, longitude], 13);
  
      // Añade una capa de mosaico (ajusta la URL del mosaico según tus necesidades)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
  
      // Añade un marcador en la ubicación
      L.marker([latitude, longitude]).addTo(map);
    }
  }
  
  

  /*async presentAlert(note: any) {
    let messageContent = `
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
  `;

    // Agrega la sección de imagen si hay una imagen en la nota
    if (note.img) {
      
      messageContent += `
      <div>
        <img src='${note.img}' alt='Imagen de la nota'>
      </div>
    `;
    }

    // Agrega la sección de posición si hay una posición en la nota
    if (note.position) {
      messageContent += `
      <div *ngIf='note.position'>
        <div id="map" style="height: 200px;"></div>
      </div>
    `;
    }

    // Cierra el div principal
    messageContent += `</div>`;

    const alert = await this.alertController.create({
      header: 'Detalles de la Nota',
      subHeader: 'A Sub Header Is Optional',
      message: messageContent,
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

    // Obtén el elemento del mapa
    const mapElement = document.getElementById('map');

    if (mapElement && note.position) {
      // Crea un mapa Leaflet
      const map = L.map(mapElement).setView([note.position.latitude, note.position.longitude], 13);

      // Añade una capa de mosaico (puedes ajustar la URL del mosaico según tus necesidades)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Añade un marcador en la ubicación
      L.marker([note.position.latitude, note.position.longitude]).addTo(map);
    }
  }*/





  /*editNote(){

  }*/

  async editNote(note: any) {
    this.editForm.setValue({
      title: note.title,
      description: note.description || '',
      img: note.img || '',
      position: {
        latitude: note.position?.latitude || '',
        longitude: note.position?.longitude || ''
      },
      date: note.date
    });

    const alert = await this.alertController.create({
      header: 'Editar Nota',
      message: `
      <ion-label>
        <ion-input formControlName="title" value=${note.title}></ion-input>
      </ion-label>
      <ion-label *ngIf="editForm.get('description').value">
        <ion-textarea formControlName="description" value=${note.description}></ion-textarea>
      </ion-label>
      <ion-label *ngIf="editForm.get('date').value">
        <ion-textarea formControlName="date" value=${note.date}></ion-textarea>
      </ion-label>
      
        <div>
          <img src='${note.img}' alt='Imagen de la nota'>
        </div>
      
        <div *ngIf='note.position'>
          <div id="map" style="height: 200px;"></div>
        </div>
      <!-- Ajusta otros campos según tu modelo de nota -->
    `,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Manejar cancelación
          }
        },
        {
          text: 'Guardar',
          handler: () => {
            const editedNote = this.editForm.value;
            // Actualizar la nota utilizando el servicio
          }
        }
      ]
    });

    const messageElement = await alert.querySelector('.alert-message');

    if(messageElement && messageElement.textContent !== null){
      messageElement.innerHTML = messageElement.textContent;
    }

    // Obtén el elemento del mapa
    L.Icon.Default.imagePath = 'assets/leaflet/images/';
    const mapElement = document.getElementById('map');

    if (mapElement && note.position) {
      // Crea un mapa Leaflet
      const map = L.map(mapElement).setView([note.position.latitude, note.position.longitude], 13);

      // Añade una capa de mosaico (puedes ajustar la URL del mosaico según tus necesidades)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Añade un marcador en la ubicación
      L.marker([note.position.latitude, note.position.longitude]).addTo(map);
    }

    await alert.present();
  }

  /*private buildEditFormHtml(): string {
    return `
      <ion-label>
        <ion-input formControlName="title" placeholder="Título"></ion-input>
      </ion-label>
      <ion-label *ngIf="editForm.get('description').value">
        <ion-textarea formControlName="description" placeholder="Descripción"></ion-textarea>
      </ion-label>
      <ion-label *ngIf="editForm.get('img').value">
        <ion-input formControlName="img" placeholder="URL de la imagen"></ion-input>
      </ion-label>
      <ion-label *ngIf="editForm.get('position.latitude').value">
        <ion-input formControlName="position.latitude" placeholder="Latitud"></ion-input>
      </ion-label>
      <ion-label *ngIf="editForm.get('position.longitude').value">
        <ion-input formControlName="position.longitude" placeholder="Longitud"></ion-input>
      </ion-label>
      <!-- Ajusta otros campos según tu modelo de nota -->
    `;
  }*/


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