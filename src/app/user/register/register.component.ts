import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  showAlert = false;
  alertMessage = 'Please wait! your account is being created.';
  alertColor = 'blue';

  inSubmission = false;

  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),

      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        [this.emailTaken.validate]
      ),

      age: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(120),
      ]),

      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
        ),
      ]),

      confirmPassword: new FormControl(''),

      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
      ]),
    },
    [RegisterValidators.match('password', 'confirmPassword')]
  );

  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! your account is being created.';
    this.alertColor = 'blue';
    this.inSubmission = true;

    try {
      await this.auth.createUser(this.registerForm.value as IUser);

      this.alertMessage = 'Success! Your account has been created.';
      this.alertColor = 'green';
    } catch (err) {
      console.log(err);

      // Error handling not complete yet...
      this.alertMessage =
        'An unexpected error occurred. Please try again later!';
      this.alertColor = 'red';
      this.inSubmission = false;
    }
  }
}
