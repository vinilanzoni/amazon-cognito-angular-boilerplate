import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoService } from '../../service/cognito.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
  });

  messages: String[] = [];

  constructor(
    private readonly cognitoService: CognitoService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
  }

  close(index: number) {
    this.messages.splice(index, 1);
  }

  async onSubmit() {
    try {
      await this.cognitoService.signIn(this.signInForm.get('email')!.value!, this.signInForm.get('password')!.value!);
      this.router.navigate(['home'])
    } catch (error: any) {
      this.messages.push(error.message);
    }
  }

}
