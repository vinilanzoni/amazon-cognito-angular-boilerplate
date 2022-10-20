import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { CognitoService } from '../../service/cognito.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [ Validators.required, Validators.email ]),
    code: new FormControl('', [Validators.required]),
    password: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
    passwordRepeat: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
  });

  dangerMessages: String[] = [];
  infoMessages: String[] = [];

  faChevronLeft = faChevronLeft;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly cognitoService: CognitoService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let email = params['email'];
      if (email) {
        this.resetPasswordForm.get('email')!.setValue(email);
      }
    });
  }

  closeDanger(index: number) {
    this.dangerMessages.splice(index, 1);
  }

  closeInfo(index: number) {
    this.infoMessages.splice(index, 1);
  }

  isFormValid(): boolean {
    return this.resetPasswordForm.valid && this.resetPasswordForm.get('password')!.value === this.resetPasswordForm.get('passwordRepeat')!.value;
  }

  async resendCode() {
    try {
      await this.cognitoService.forgotPassword(this.resetPasswordForm.get('email')!.value!);
      this.infoMessages.push('Código reenviado com sucesso.');
    } catch (err: any) {
      this.dangerMessages.push(err.message);
    }
  }

  async onSubmit() {
    try {
      await this.cognitoService.confirmPassword(this.resetPasswordForm.get('email')!.value!, this.resetPasswordForm.get('code')!.value!, this.resetPasswordForm.get('password')!.value!);
      this.router.navigate(['auth/sign-in']);
    } catch (err: any) {
      this.dangerMessages.push(err.message);
    }
  }

}
