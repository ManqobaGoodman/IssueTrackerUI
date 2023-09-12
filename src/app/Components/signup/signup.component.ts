import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string ="fa-eye-slash";
  constructor(private fb: FormBuilder , private auth: AuthService, private router: Router, private toast: NgToastService) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      email: ['',Validators.required],
      username: ['',Validators.required],
      password: ['',Validators.required]
    });
  }

  HideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye": this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type ="text":this.type ="password";
  }

  onSignUp(){
    if(this.signupForm.valid){
      console.log(this.signupForm.value);
      this.auth.signIn(this.signupForm.value)
      .subscribe({
        next: (res) => {
         // alert(res.message)
         this.toast.success({detail:'Succes',summary:res.message,duration:3000});
          this.signupForm.reset();
          this.router.navigate(['login']);
        },

        error: (err) => {
          this.toast.error({detail:'Error',summary:err?.error.message,duration:3000})
        }
      })
    }else{
      console.log("Form is invalid");
      ValidateForm.validateAllFormFileds(this.signupForm);
      alert("Your form is invalid");
    }
  }

}
