import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  BehaviorSubject,
  of,
  combineLatest,
  lastValueFrom,
  Observable,
} from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import IClip from '../models/clip.model';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService implements Resolve<IClip | null> {
  private clipsCollection: AngularFirestoreCollection<IClip>;
  private isPending = false;
  public pageClips: IClip[] = [];

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = db.collection('clips');
  }

  async createClip(clip: IClip) {
    return await this.clipsCollection.add(clip);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    try {
      return combineLatest([this.auth.user, sort$]).pipe(
        switchMap(([user, sort]) => {
          if (!user) return of([]);

          const query = this.clipsCollection.ref
            .where('uid', '==', user.uid)
            .orderBy('timestamp', sort == '1' ? 'desc' : 'asc');

          return query.get();
        }),

        map((querySnapshot) => (querySnapshot as QuerySnapshot<IClip>).docs)
      );
    } catch (err) {
      throw err;
    }
  }

  async getClips() {
    if (this.isPending) return;

    this.isPending = true;

    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6);

    if (this.pageClips.length) {
      const lastClipID = this.pageClips.at(-1)!.docID;

      const lastClip = await lastValueFrom(
        this.clipsCollection.doc(lastClipID).get()
      );

      query = query.startAfter(lastClip);
    }

    const snapshot = await query.get();

    const clips = snapshot.docs;

    clips.forEach((clip) => {
      this.pageClips.push({
        docID: clip.id,
        ...clip.data(),
      });
    });

    this.isPending = false;
  }

  async updateClip(id: string, title: string) {
    try {
      await this.clipsCollection.doc(id).update({
        title,
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteClip(clip: IClip) {
    try {
      const clipRef = this.storage.ref(`clips/${clip.fileName}`);
      const screenshotRef = this.storage.ref(
        `screenshots/${clip.screenshotName}`
      );

      await Promise.all([
        clipRef.delete(),
        screenshotRef.delete(),
        this.clipsCollection.doc(clip.docID).delete(),
      ]);
    } catch (err) {
      throw err;
    }
  }

  resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
    return this.clipsCollection
      .doc(route.params.id)
      .get()
      .pipe(
        map((documentSnapshot) => {
          const data = documentSnapshot.data();

          if (!data) {
            this.router.navigateByUrl('/');
            return null;
          }

          return data;
        })
      );
  }
}
