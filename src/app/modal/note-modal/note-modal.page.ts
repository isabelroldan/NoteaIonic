import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { ModalController, NavParams } from '@ionic/angular/standalone';
import { NoteService } from 'src/app/services/note.service';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.page.html',
  styleUrls: ['./note-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NoteModalPage implements OnInit {
  @Input() note!: Note;

  public noteS: NoteService

  constructor(noteS:NoteService, private modalCtrl: ModalController,) {
    this.noteS = noteS;
  }

  ngOnInit() {
    console.log(this.note);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.note, 'confirm');
  }
}
