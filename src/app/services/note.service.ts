import { Injectable, inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { collectionData, collection, Firestore } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment';
import { Note } from '../model/note';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  myCollection: AngularFirestoreCollection<any>;
  private fireStore: AngularFirestore = inject(AngularFirestore);

  public notes$!: Observable<Note[]>;
  private fire: Firestore = inject(Firestore);

  constructor() { 
    this.myCollection = this.fireStore.collection<any>(environment.firebaseConfig.collectionName);

    this.notes$ = collectionData(
      collection(this.fire, environment.firebaseConfig.collectionName), {idField: 'key'}) as Observable<Note[]>;
  }

  addNote(note: Note): Promise<DocumentReference> {
    return this.myCollection.add(note);
  }

  readAll(): Observable<any> {
    return this.myCollection.get();
  }

  readNote(key: string): Observable<any> {
    return this.myCollection.doc(key).get();
  }

  updateNote(note: Note): Promise<void> {
    return new Promise( async (resolve, reject) => {
      if(!note.key) reject('Key not defined');
      const { key, ...data } = note;
      try {
        resolve(await this.myCollection.doc(note.key).set(data));
      }catch(err) {
        reject(err);
      }
    })
  }

  deleteNote(note: Note): Promise<void> {
    return new Promise((resolve, reject) => {
      if(!note.key) reject('Key not defined');
      try {
        resolve(this.myCollection.doc(note.key).delete());
      } catch(err) {
        reject(err);
      }
    })
  }

}