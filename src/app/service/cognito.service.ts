import { Injectable } from '@angular/core';
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession, ISignUpResult } from 'amazon-cognito-identity-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  poolData = {
    UserPoolId: environment.cognitoUserPoolId,
    ClientId: environment.cognitoAppClientId
  };

  userPool = new CognitoUserPool(this.poolData);

  constructor() { }

  isLoggedIn(): boolean {
    let isSessionValid = false;
    let cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err: any, session: CognitoUserSession) => {
        if (err) {
          console.error(err);
          throw Error(err);
        }
        isSessionValid = session.isValid();
      });
    }
    return isSessionValid;
  }

  resendCode(email: string): Promise<any> {
    let cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  }

  signIn(email: string, password: string): Promise<CognitoUserSession> {
    let authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    })

    let cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    })

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          console.error(result);
          resolve(result);
        },
        onFailure: function (err) {
          console.log(err);
          reject(err);
        },
      });
    });
  }

  signOut() {
    let cognitoUser = this.userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
  }

  signUp(name: string, email: string, password: string ): Promise<ISignUpResult> {

    var attributeList: CognitoUserAttribute[] = [];

    attributeList.push(new CognitoUserAttribute({ Name: 'email', Value: email }));
    attributeList.push(new CognitoUserAttribute({ Name: 'name', Value: name }));

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        console.log(result);
        resolve(result!);
      });
    });
  }

  validate(email: string, code: string): Promise<any> {
    let cognitoUser = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        console.log(result);
        resolve(result);
      });
    });
  }
}
