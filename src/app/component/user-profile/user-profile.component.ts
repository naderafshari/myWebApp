import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';   
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UserInfo } from '../../provider/user-info';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})

export class UserProfileComponent implements OnInit {
  usersCol: AngularFirestoreCollection<UserInfo>;
  usersDoc: Observable<UserInfo[]>;
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;
  
  constructor(private afs: AngularFirestore, 
              public authService: AuthService, 
              private router:Router) { 

    this.user = authService.user
    .subscribe((user) => {
      this.user = user;
      if (user) {
        this.userDoc = this.afs.doc(`users/${user.uid}`).valueChanges();
        this.userDoc.subscribe((data: UserInfo) => {
          this.userInfo = data;
        });
      }
    });
  }

  ngOnInit() {
  }
  
  updateUser() {
    if (this.user != null && this.userInfo != null) {
      console.log('User:', this.user.uid);
      this.afs.collection('users').doc(this.user.uid).update(this.userInfo);
    }
    else{
      console.log('Cannot Update, user not logged in!');
      this.router.navigateByUrl('/login');
    }
  }

  logout() {
    this.authService.logout();
    /*.then(
      () => {
              this.router.navigateByUrl('/login');
      },
      err => alert(err)
    );*/
  }
}
