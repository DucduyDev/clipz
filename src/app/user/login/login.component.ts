import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ErrorCode } from 'src/app/shared/types/error-code';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { email: '', password: '' };

  showAlert = false;
  alertMessage = 'Please wait! We are logging you in.';
  alertColor = 'blue';
  inSubmission = false;

  constructor(private auth: AngularFireAuth) {}

  async login() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
      this.alertMessage = 'Success! You are now logged in.';
      this.alertColor = 'green';
    } catch (err) {
      switch ((err as ErrorCode).code) {
        case 'auth/user-disabled':
          this.alertMessage = 'Your account has been disabled!';
          break;
        case 'auth/user-not-found':
          this.alertMessage = 'Account not found!';
          break;
        case 'auth/wrong-password':
          this.alertMessage = 'Email or password is invalid! Please try again.';
          break;
      }

      this.alertColor = 'red';
      this.inSubmission = false;
    }
  }
}
