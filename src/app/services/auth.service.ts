import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { delay, map, filter, switchMap, Observable, of, tap } from 'rxjs';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Initializing a value for this property cannot be done util the service for the database has been injected
  private usersCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    // Whenever routes change => eventS will be fired => "NavigationEnd" event gets emitted whenever the router is finished navigating to a route
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),

        map(() => this.route.firstChild),

        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => {
        this.redirect = data?.authOnly ?? false;
      });
  }

  async createUser(user: IUser) {
    try {
      if (!user.password) throw new Error('Password not provided!');

      const userCredentials = await this.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );

      if (!userCredentials.user) throw new Error("User can't be found!");

      const { uid } = userCredentials.user;

      // creates a collection if the collection doesn't exist
      await this.usersCollection.doc(uid).set({
        name: user.name,
        email: user.email,
        age: user.age,
        phoneNumber: user.phoneNumber,
      });

      await userCredentials.user.updateProfile({
        displayName: user.name,
      });
    } catch (err) {
      throw err;
    }
  }

  async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }

    try {
      await this.auth.signOut();

      // Redirect the user back to the home after he's logged out
      if (this.redirect) await this.router.navigateByUrl('/');
    } catch (err) {
      throw err;
    }
  }
}
