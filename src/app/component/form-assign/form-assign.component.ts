import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../provider/auth.service';
import { UserInfo } from '../../model/user-info';
import { Observable } from 'rxjs/Observable';
import { Form } from '../../model/form';
import { FormService } from '../../provider/form.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-form-assign',
  templateUrl: './form-assign.component.html',
  styleUrls: ['./form-assign.component.css']
})
export class FormAssignComponent implements OnInit, OnDestroy {
  uid: string;
  forms: Observable<Form[]>;
  formData: Form;
  userDoc: Observable<{}>;
  user: any;
  userInfo: UserInfo;
  sub: Subscription;

  constructor(private afs: AngularFirestore,
              private router: Router,
              private route: ActivatedRoute,
              public fs: FormService) {
    this.route.params.subscribe(params => {
      this.uid = params['uid'] || 0;
      if (this.uid) {
        this.forms = this.fs.getForms();
        this.userDoc = this.afs.doc(`users/${this.uid}`).valueChanges();
        this.sub = this.userDoc.subscribe((data: UserInfo) => this.userInfo = data);
      }
    });
  }

  assignClick(formId) {
    this.fs.assignForm(formId, this.uid);
    alert('Form assigned successfully.');
    this.router.navigateByUrl('/user-manage');
  }

  unAssignClick(formId) {
    this.fs.unAssignForm(formId, this.uid);
    alert('Form Unassigned successfully.');
    this.router.navigateByUrl('/user-manage');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
