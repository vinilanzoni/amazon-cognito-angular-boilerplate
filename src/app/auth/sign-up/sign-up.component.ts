import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { CognitoService } from '../../service/cognito.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signUpForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
    passwordRepeat: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
  });

  messages: String[] = [];

  faChevronLeft = faChevronLeft;

  constructor(
    private readonly cognitoService: CognitoService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
  }

  close(index: number) {
    this.messages.splice(index, 1);
  }

  isFormValid(): boolean {
    return this.signUpForm.valid && this.signUpForm.get('password')!.value === this.signUpForm.get('passwordRepeat')!.value;
  }

  async onSubmit() {
    try {
      await this.cognitoService.signUp(this.signUpForm.get('name')!.value!, this.signUpForm.get('email')!.value!, this.signUpForm.get('password')!.value!);
      this.router.navigate(['auth/validate'], { queryParams: { email: this.signUpForm.get('email')!.value! }});
    } catch (error: any) {
      this.messages.push(error.message);
    }
  }

}
