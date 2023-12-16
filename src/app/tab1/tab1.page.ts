import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, inject } from '@angular/core';
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
import { DomSanitizer } from '@angular/platform-browser';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { NgZone } from '@angular/core';




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

  public imageBase64: string | null;

  public map: any;
  public marker: any;

  mapLoaded: boolean = false;

  detectedText: string = '';

  

  constructor(public sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.form = this.fromB.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['']
    })

    // Inicializar las variables globales
    this.latitude = null;
    this.longitude = null;

    this.imageBase64 = null;
  }

  /**
 * Extracts the current geolocation.
 */
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
      this.showMap(this.latitude, this.longitude); 
    } catch (error) {
      console.error('Error getting location:', error);
      await this.UIS.showToast('Error al obtener la ubicación', 'warning');

    }
  }

  /**
 * Takes a photo using the device camera.
 */
  public async takePic() {
    try {
      const image = await Camera.getPhoto({
        quality: 60,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });

      // Asignar la URI de la imagen a la variable global si está disponible
      if (image.base64String !== undefined) {
        this.imageBase64 = image.base64String;
        console.log(this.imageBase64);
      }

    } catch (error) {
      console.error('Error taking photo:', error);
      await this.UIS.showToast('Error al tomar la foto', 'warning');

    }
  }

  /**
 * Saves a note.
 * @returns A promise that resolves when the note is saved.
 */
  async saveNote(): Promise<void> {
    if (!this.form.valid) return;

    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: Date.now().toLocaleString()
    }

    if (this.latitude != null && this.longitude != null) {
      note.position = {
        latitude: this.latitude,
        longitude: this.longitude
      }
    }

    if (this.imageBase64 != null) {
      note.img = this.imageBase64;
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

  /**
 * Shows a map with the specified latitude and longitude.
 * @param latitude - The latitude of the location to be shown on the map.
 * @param longitude - The longitude of the location to be shown on the map.
 */
  showMap(latitude: number, longitude: number): void {

    if (this.map) {
      this.map.remove();
      this.map = null;
    }

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
      this.marker.setLatLng([latitude, longitude]).update();
    }
  }

  async checkAndRequestPermissions() {
    const permissionStatus = await SpeechRecognition.checkPermissions();
    
    if (permissionStatus.speechRecognition !== 'granted') {
      const requestResult = await SpeechRecognition.requestPermissions();
      
      if (requestResult.speechRecognition !== 'granted') {
        console.error('Permiso denegado para acceder al micrófono.');
        // Puedes mostrar un mensaje al usuario para informar sobre la importancia de los permisos.
        return;
      }
    }
    // Continuar con el reconocimiento de voz
    this.startSpeechRecognition();
  }
  

  startSpeechRecognition() {
    SpeechRecognition.available().then((result) => {
      if (result.available) {
        SpeechRecognition.start({
          language: "es-ES",
          maxResults: 1,
          prompt: "Di algo",
          partialResults: true,
          popup: false,
        }).then(() => {
          console.log("Speech Recognition Started!!!!!!!!!!!!!!!!!!");
          SpeechRecognition.addListener("partialResults", (data: { matches: string[]; }) => {
            console.log("Speech Recognition Data.........:", data);
  
            // Utilizar ngZone.run para garantizar la detección de cambios
            this.ngZone.run(() => {
              this.detectedText = data.matches.join(" ");
              console.log(this.detectedText);
            });
          });
        }).catch(error => {
          console.error("Speech Recognition Error:", error);
        });
      } else {
        console.warn("Reconocimiento de voz no disponible en este dispositivo.");
      }
    });
  }
  
  
  
}