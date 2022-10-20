import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { CognitoService } from '../../service/cognito.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
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

  async onSubmit() {
    try {
      await this.cognitoService.forgotPassword(this.forgotPasswordForm.get('email')!.value!);
      this.router.navigate(['auth/reset-password'], { queryParams: { email: this.forgotPasswordForm.get('email')!.value! } });
    } catch (error: any) {
      this.messages.push(error.message);
    }
  }
}
