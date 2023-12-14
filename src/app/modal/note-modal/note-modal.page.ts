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

  constructor(noteS:NoteService, private modalCtrl: ModalController,) {
    this.noteS = noteS;
  }

  ngOnInit() {
    console.log(this.note);
  }

  ngAfterViewInit() {
    if (this.note.position) {
      this.initializeMap();
    }
  }

  initializeMap() {
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
  }

  removeMap() {
    if (this.note.position) {
      this.note.position.latitude = null;
      this.note.position.longitude = null;
    }
    if (this.map) {
      this.map.remove();
    }
  }

  

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    console.log("Segundo..."+ this.note.img);
    console.log("Tercero..."+ this.note);
    return this.modalCtrl.dismiss(this.note, 'confirm');
  }

  removeImage() {
    this.note.img = "";
    console.log("Primero...."+this.note.img);

  }
}
