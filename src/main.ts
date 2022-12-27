import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { environment } from './environments/environment';

import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';

if (environment.production) {
  enableProdMode();
}

// initializes Firebase
// connects app to Firebase
firebase.initializeApp(environment.firebase);

let appInit = false;

// runs at least once => it's safe to load Angular after the event fires
firebase.auth().onAuthStateChanged(() => {
  if (appInit) return;

  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));

  appInit = true;
});
