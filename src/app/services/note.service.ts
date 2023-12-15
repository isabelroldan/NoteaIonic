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
      collection(this.fire, environment.firebaseConfig.collectionName), { idField: 'key' }) as Observable<Note[]>;
  }

  /**
 * Reads the next batch of elements from the collection.
 * 
 * @param firstElement The first element to start after. Default is null.
 * @param numberOfElements The number of elements to retrieve. Default is 15.
 * @returns A promise that resolves with the next batch of elements from the collection.
 */
  readNext(firstElement: any = null, numberOfElements: number = 15): Promise<any> {
    if (firstElement)
      return this.myCollection.ref.orderBy('date', 'asc').startAfter(firstElement).limit(numberOfElements).get();
    else
      return this.myCollection.ref.orderBy('date', 'asc').startAfter(firstElement).limit(numberOfElements).get();

  }

  /**
 * Adds a new note to the collection.
 * 
 * @param note The note object to add.
 * @returns A promise that resolves with the reference to the added document.
 */
  addNote(note: Note): Promise<DocumentReference> {
    return this.myCollection.add(note);
  }

  /**
 * Reads all the documents from the collection.
 * 
 * @returns An observable that emits the documents from the collection.
 */
  readAll(): Observable<any> {
    return this.myCollection.get();
  }

  /**
 * Reads a specific note from the collection.
 * 
 * @param key The key of the note to read.
 * @returns An observable that emits the document with the specified key.
 */
  readNote(key: string): Observable<any> {
    return this.myCollection.doc(key).get();
  }

  /**
 * Updates a note in the collection.
 * 
 * @param note The note object to update.
 * @returns A promise that resolves when the note is updated.
 */
  updateNote(note: Note): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!note.key) reject('Key not defined');
      const { key, ...data } = note;
      try {
        resolve(await this.myCollection.doc(note.key).set(data));
      } catch (err) {
        reject(err);
      }
    })
  }

  /**
 * Deletes a note from the collection.
 * 
 * @param note The note object to delete.
 * @returns A promise that resolves when the note is deleted.
 */
  deleteNote(note: Note): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!note.key) reject('Key not defined');
      try {
        resolve(this.myCollection.doc(note.key).delete());
      } catch (err) {
        reject(err);
      }
    })
  }

}