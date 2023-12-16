import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { ModalController, NavParams } from '@ionic/angular/standalone';
import { NoteService } from 'src/app/services/note.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.page.html',
  styleUrls: ['./note-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NoteModalPage implements OnInit, AfterViewInit {
  @Input() note!: Note;

  public noteS: NoteService
  private map!: L.Map;

  constructor(noteS: NoteService, private modalCtrl: ModalController,) {
    this.noteS = noteS;
  }

  /**
 * Lifecycle hook that is called when the component is initialized.
 * Log the value of the 'note' property
 */
  ngOnInit() {
    console.log(this.note);
  }

  /**
 * Lifecycle hook that is called after the view has been initialized.
 * Call the initializeMap() method if the note has a position
 */
  ngAfterViewInit() {
    if (this.note.position) {
      this.initializeMap();
    }
  }

  /**
 * Initializes the map.
 */
  /*initializeMap() {
    if (!this.map) { // Verificar si el mapa ya se ha inicializado
      const mapElement = document.getElementById('map');
      if (mapElement) {
        this.map = L.map(mapElement).setView([this.note.position?.latitude ?? 0, this.note.position?.longitude ?? 0], 16);
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
  
        if (this.note.position?.latitude && this.note.position?.longitude) {
          const iconUrl = 'assets/leaflet/images/marker-icon.png';
          const shadowUrl = 'assets/leaflet/images/marker-shadow.png';
  
          const defaultIcon = L.icon({
            iconUrl: iconUrl,
            shadowUrl: shadowUrl,
          });
  
          L.marker([this.note.position.latitude, this.note.position.longitude], { icon: defaultIcon }).addTo(this.map);
        }
      }
    }
  }*/

  initializeMap() {
    if (!this.map) { // Verificar si el mapa ya se ha inicializado
      setTimeout(() => {
        const mapElement = document.getElementById('map');
        if (mapElement) {
          this.map = L.map(mapElement).setView([this.note.position?.latitude ?? 0, this.note.position?.longitude ?? 0], 16);
  
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);
  
          if (this.note.position?.latitude && this.note.position?.longitude) {
            const iconUrl = 'assets/leaflet/images/marker-icon.png';
            const shadowUrl = 'assets/leaflet/images/marker-shadow.png';
  
            const defaultIcon = L.icon({
              iconUrl: iconUrl,
              shadowUrl: shadowUrl,
            });
  
            L.marker([this.note.position.latitude, this.note.position.longitude], { icon: defaultIcon }).addTo(this.map);
          }
        }
      }, 5000); // Delay of 5 seconds
    }
  }
  
  /*initializeMap() {
    if (!this.map) { // Verificar si el mapa ya se ha inicializado
      const mapElement = document.getElementById('map');
      if (mapElement) {
        this.map = L.map(mapElement).setView([this.note.position?.latitude ?? 0, this.note.position?.longitude ?? 0], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        if (this.note.position?.latitude && this.note.position?.longitude) {
          L.marker([this.note.position.latitude, this.note.position.longitude]).addTo(this.map);
        }
      }
    }
  }*/

  /**
 * Removes the map.
 */
  removeMap() {
    if (this.note.position) {
      this.note.position.latitude = null;
      this.note.position.longitude = null;
    }
    if (this.map) {
      this.map.remove();
    }
  }

  /**
 * Cancels the modal.
 * 
 * @returns A promise that resolves when the modal is dismissed with a 'cancel' role.
 */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /**
 * Confirms the modal.
 * 
 * @returns A promise that resolves when the modal is dismissed with a 'confirm' role.
 */
  confirm() {
    console.log("Segundo..." + this.note.img);
    console.log("Tercero..." + this.note);
    return this.modalCtrl.dismiss(this.note, 'confirm');
  }

  /**
 * Removes the image from the note.
 */
  removeImage() {
    this.note.img = "";
    console.log("Primero...." + this.note.img);

  }
}
