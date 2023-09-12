import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private resetPasswordService: ResetPasswordService,
    private router: Router, private toast: NgToastService, private userStoreService: UserStoreService) {

  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  HideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogIn() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.auth.logIn(this.loginForm.value)
        .subscribe({
          next: (res) => {
            this.loginForm.reset();
            this.auth.storeToken(res.accessToken);
            this.auth.storeRefreshToken(res.refreshToken);
            const tokenPlayload = this.auth.decodedToken();
            this.userStoreService.setFullNameFromStore(tokenPlayload.unique_name);
            this.userStoreService.setRoleFromStore(tokenPlayload.role);
            this.toast.success({ detail: 'Succes', summary: res.message, duration: 3000 });
            this.router.navigate(['dashbard']);
          },
          error: (err) => {
            //alert(err?.error.message);
            this.toast.error({ detail: 'Error', summary: err?.error.message, duration: 3000 });
          }
        })
    } else {
      console.log("Form is invalid");
      ValidateForm.validateAllFormFileds(this.loginForm);
      alert("Your form is invalid");
    }
  }
  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      console.log('Email: ' + this.resetPasswordEmail);


      this.resetPasswordService.sendEmailPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next: (res) => {
            this.toast.success({ detail: 'Success', summary: 'Email successful sent', duration: 3000 });
            this.resetPasswordEmail = "";
            const buttonRef = document.getElementById("closeBtn");
            buttonRef?.click();
          },
          error: (err) => {
            this.toast.error({ detail: 'Error', summary: 'Something went wrong!', duration: 5000 });
          }
        })
    }
  }

}
