import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { CognitoService } from '../service/cognito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private readonly cognitoService: CognitoService,
    private readonly router: Router,
  ) { }

  faRightFromBracket = faRightFromBracket;

  ngOnInit(): void {
  }

  signOut(): void {
    this.cognitoService.signOut();
    this.router.navigate(['/auth']);
  }

}
