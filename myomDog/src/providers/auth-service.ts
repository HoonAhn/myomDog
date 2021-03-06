import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import  firebase  from 'firebase';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {

  // AngularFire2 docs 참조해서 작성중 -----------
  private authState: Observable<firebase.User>;
  public currentUser: firebase.User;
  // ----------- AngularFire2 docs 참조해서 작성중

  // public currentUser: any;
  public userData: any;
  public email: string;
  public inviteData: any;

  constructor(public http: Http, public afAuth: AngularFireAuth) {
    console.log('Hello AuthService Provider');

    this.authState= afAuth.authState;
    this.authState.subscribe((user: firebase.User) => {
      this.currentUser = user;
    });
    console.log("In AuthService: "+this.currentUser);

    /*
    this.fireAuth.onAuthStateChanged( function (user) {
      if(user) {
        console.log("User "+ user.email +" Logged in.");
        // this.authService.email = user.email;
        // this.nav.setRoot(TabsPage);
        // this.rootPage = TabsPage;
      }
      else {
        console.log("User Logged out.");
        // this.nav.setRoot(LoginPage);
        // this.rootPage = LoginPage;
      }
    });
    */
    this.userData = firebase.database().ref('userData');
  }

  setUser(user){
    this.currentUser = user;
  }

  register(email: string, password: string, name: string): any {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((newUser) => {
        let id = newUser.email.split('.');
        let key = id[0]+'-'+id[1];
        this.userData.child(key)
        .set({
          email: email,
          name: name,
          first: false
        });
    });
  }

  resetPassword(email: string): any {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  doLogin(email: string, password: string): any {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  doLogout(): any {
    return firebase.auth().signOut();
  }

}
