import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CognitoService } from '../../service/cognito.service';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss']
})
export class ValidateComponent implements OnInit {

  validateForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [ Validators.required, Validators.email ]),
    code: new FormControl('', [ Validators.required ]),
  })

  dangerMessages: String[] = [];
  infoMessages: String[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly cognitoService: CognitoService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let email = params['email'];
      if(email) {
        this.validateForm.get('email')!.setValue(email);
      }
    });
  }

  closeDanger(index: number) {
    this.dangerMessages.splice(index, 1);
  }

  closeInfo(index: number) {
    this.infoMessages.splice(index, 1);
  }

  async resendCode() {
    try {
      await this.cognitoService.resendCode(this.validateForm.get('email')!.value!);
      this.infoMessages.push('Código de validação reenviado com sucesso.');
    } catch (err: any) {
      this.dangerMessages.push(err.message);
    }
  }

  async onSubmit() {
    try {
      await this.cognitoService.validate(this.validateForm.get('email')!.value!, this.validateForm.get('code')!.value!);
      this.router.navigate(['auth']);
    } catch (err: any) {
      this.dangerMessages.push(err.message);
    }
  }

}
