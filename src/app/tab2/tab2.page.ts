import { Component, inject } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { NoteService } from '../services/note.service';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonTitle, IonToolbar, Platform } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { Note } from '../model/note';
import * as L from 'leaflet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { NoteModalPage } from '../modal/note-modal/note-modal.page';
import { UIService } from '../services/ui.service';
import { BehaviorSubject, Observable, from, map, mergeMap, tap, toArray } from 'rxjs';


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

  private UIS = inject(UIService);

  private notesPerPage: number = 15;

  public _notes$: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);

  private lastNote: Note | undefined = undefined;

  public isInfiniteScrollAvailable: boolean = true;

  constructor(private alertController: AlertController, private formBuilder: FormBuilder, private noteService: NoteService, private modalCtrl: ModalController, public platform: Platform) {
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

  /**
 * Lifecycle method called when the view has entered.
 */
  ionViewDidEnter() {
    //this.noteS.readAll()
    this.platform.ready().then(() => {
      console.log(this.platform.height());
      this.notesPerPage = Math.round(this.platform.height() / 50);
      this.loadNotes(true);
    });
  }

  /**
 * Loads notes from a data source.
 * 
 * @param fromFirst Flag indicating whether to load notes from the first page.
 * @param event Optional event object.
 */
  loadNotes(fromFirst: boolean, event?: any) {
    console.log(this._notes$.getValue());

    if (fromFirst == false && this.lastNote == undefined) {
      this.isInfiniteScrollAvailable = false;
      event.target.complete();
      return;
    }
    this.convertPromiseToObservableFromFirebase(this.noteS.readNext(this.lastNote, this.notesPerPage)).subscribe(d => {
      event?.target.complete();
      if (fromFirst) {
        this._notes$.next(d);
      } else {
        this._notes$.next([...this._notes$.getValue(), ...d]);
        if (d.length < this.notesPerPage) {
          this.isInfiniteScrollAvailable = false;
        }
      }
    })

  }

  /**
 * Converts a promise from Firebase to an observable of Note array.
 * 
 * @param promise The promise to convert.
 * @returns An observable of Note array.
 */
  private convertPromiseToObservableFromFirebase(promise: Promise<any>): Observable<Note[]> {
    return from(promise).pipe(
      tap(d => {
        if (d.docs && d.docs.length >= this.notesPerPage) {
          this.lastNote = d.docs[d.docs.length - 1];
        } else {
          this.lastNote = undefined;
        }
      }),
      mergeMap(d => d.docs),
      map(d => {
        return { key: (d as any).id, ...(d as any).data() };
      }),
      toArray()
    );
  }

  /**
 * Performs a refresh action.
 * 
 * @param event The refresh event object.
 */
  doRefresh(event: any) {
    this.isInfiniteScrollAvailable = true;
    this.loadNotes(true, event);
  }

  /**
 * Loads more notes.
 * 
 * @param event The event object.
 */
  loadMore(event: any) {
    this.loadNotes(false, event);
  }



  initializeMap(noteKey: string, latitude: number, longitude: number) {

    const mapElement = document.getElementById(`map-${noteKey}`);

    if (mapElement && !mapElement.hasChildNodes()) {
      const map = L.map(mapElement).setView([latitude, longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);


      L.marker([latitude, longitude]).addTo(map);
    }
  }

  /**
 * Initializes a map element with the given latitude and longitude.
 * 
 * @param noteKey The key of the note.
 * @param latitude The latitude coordinate.
 * @param longitude The longitude coordinate.
 */

  async editNote(note: Note) {
    console.log(note);
    const modal = await this.modalCtrl.create({
      component: NoteModalPage,
      componentProps: { note: note },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.noteS.updateNote(data);
      //Añadir toast satisfactorio
      await this.UIS.showToast('Nota modificada correctamente', 'success');
    }
  }


  /**
 * Removes a note.
 * 
 * @param note The note to remove.
 */
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
                this.UIS.showToast('Nota eliminada correctamente', 'success');
              })
              .catch(error => {
                console.error('Error al eliminar la nota', error);
                this.UIS.showToast('Ocurrió un error, vuelva a intentarlo', 'warning');
              });
          }
        }
      ]
    });

    await alert.present();
  }

  handleSwipe(note: Note, event: any) {
    const swipeDirection = event.detail.side;
  
    if (swipeDirection === 'start') {
      // Deslizamiento hacia la izquierda (lado start)
      this.editNote(note);
    } else if (swipeDirection === 'end') {
      // Deslizamiento hacia la derecha (lado end)
      this.removeNote(note);
    }
  }

}