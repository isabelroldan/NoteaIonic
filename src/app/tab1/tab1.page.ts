import { AfterViewInit, Component, inject } from '@angular/core';
import { IonButton, IonHeader, IonContent, IonDatetime, IonDatetimeButton, IonIcon, IonItem, IonLabel, IonListHeader, IonModal, IonTitle, IonToolbar, LoadingController, IonInput } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';




@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ExploreContainerComponent, IonicModule, CommonModule],
})
export class Tab1Page {

  private fromB = inject(FormBuilder);
  private noteService = inject(NoteService);
  public loadignService = inject(LoadingController);
  private UIS = inject(UIService);

  private myLoading!: HTMLIonLoadingElement;
  public form!: FormGroup;

  public latitude: number | null;
  public longitude: number | null;

  public imageUri: string | null;

  public map: any;
  public marker: any;

  mapLoaded: boolean = false;

  constructor() {
    this.form = this.fromB.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['']
    })

    // Inicializar las variables globales
    this.latitude = null;
    this.longitude = null;

    this.imageUri = null;
  }


  public async extractGeolocation() {
    try {
      this.mapLoaded = true;
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Tu posición actual es: ');
      console.log('Latitude:', coordinates.coords.latitude);
      console.log('Longitude:', coordinates.coords.longitude);

      // Guardar la latitud y longitud en variables globales
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;

      // Llamar a la función para mostrar el mapa
      this.showMap(this.latitude, this.longitude); //////////////////////
    } catch (error) {
      console.error('Error getting location:', error);
      await this.UIS.showToast('Error al obtener la ubicación', 'warning');

    }
  }

  public async takePic() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });

      // Asignar la URI de la imagen a la variable global si está disponible
      if (image.webPath !== undefined) {
        this.imageUri = image.webPath;
      }

    } catch (error) {
      console.error('Error taking photo:', error);
      await this.UIS.showToast('Error al tomar la foto', 'warning');

    }
  }

  async saveNote(): Promise<void> {
    if (!this.form.valid) return;

    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: Date.now().toLocaleString()
    }

    // Agregar la posición a la nota si está disponible
    if (this.latitude != null && this.longitude != null) {
      note.position = {
        latitude: this.latitude,
        longitude: this.longitude
      }
    }

    // Agregar la imagen a la nota si está disponible
    if (this.imageUri != null) {
      note.img = this.imageUri;
    }

    await this.UIS.showLoading();

    try {
      await this.noteService.addNote(note);
      await this.UIS.showToast('Nota introducida correctamente', 'success');
      this.form.reset();

    } catch (err) {
      console.error(err);
      await this.UIS.showToast('Error al introducir la nota', 'warning');

    } finally {
      await this.UIS.hideLoading();

    }
  }

  showMap(latitude: number, longitude: number): void {

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    // Configurar la ruta de las imágenes del icono del marcador
    L.Icon.Default.imagePath = 'assets/leaflet/images/';

    if (!this.map) {
      this.map = L.map('map').setView([latitude, longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);



      this.marker = L.marker([latitude, longitude]).addTo(this.map)
      .bindPopup('Tu ubicación actual es:\nLatitud: ' + latitude.toFixed(4) + '\nLongitud: ' + longitude.toFixed(4))
        .openPopup();

        
    } else {
      // Si el mapa ya está creado, simplemente actualiza la posición del marcador
      this.marker.setLatLng([latitude, longitude]).update();
    }
  }




  /*async saveNote(): Promise<void> {
    if(!this.form.valid) return;

    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: Date.now().toLocaleString()  
    }

    await this.UIS.showLoading();

    try {
      await this.noteService.addNote(note);
      await this.UIS.showToast('Nota introducida correctamente', 'success');
      this.form.reset();

    } catch(err) {
      console.error(err);
      await this.UIS.showToast('Error al introducir la nota', 'warning');

    } finally {
      await this.UIS.hideLoading();

    }
  }*/

  /*public async takePic() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

  }*/

  /*public async extractGeolocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      //console.log('Current position:', coordinates);
      console.log('Tu posición actual es: ');
      console.log('Latitude:', coordinates.coords.latitude);
      console.log('Longitude:', coordinates.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }*/
}