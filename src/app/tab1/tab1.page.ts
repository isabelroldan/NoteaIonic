import { Component, inject } from '@angular/core';
import { IonButton, IonHeader, IonContent, IonDatetime, IonDatetimeButton, IonIcon, IonItem, IonLabel, IonListHeader, IonModal, IonTitle, IonToolbar, LoadingController, IonInput } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, ExploreContainerComponent, IonicModule],
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

  constructor() {
    this.form = this.fromB.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      description: ['']
    })

    // Inicializar las variables globales
    this.latitude = null;
    this.longitude = null;
  }
  

  public async extractGeolocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Tu posición actual es: ');
      console.log('Latitude:', coordinates.coords.latitude);
      console.log('Longitude:', coordinates.coords.longitude);
  
      // Guardar la latitud y longitud en variables globales
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
  
    } catch(error) {
      console.error('Error getting location:', error);
      await this.UIS.showToast('Error al obtener la ubicación', 'warning');
  
    }
  }

  async saveNote(): Promise<void> {
    if(!this.form.valid) return;
  
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: Date.now().toLocaleString()  
    }
  
    // Agregar la posición a la nota si está disponible
    if(this.latitude != null && this.longitude != null) {
      note.position = {
        latitude: this.latitude,
        longitude: this.longitude
      }
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

  public async takePic() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

  }

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