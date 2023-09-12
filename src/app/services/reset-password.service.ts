import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResetPassword } from '../models/reset-password.model';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private basedURL: string = "https://localhost:7290/api/User";
  constructor(private httpClient: HttpClient) { }

  sendEmailPasswordLink(email: string){
    return this.httpClient.post<any>(`${this.basedURL}/send-reset-email/${email}`,{});
  }

  resetPassword(resetPasswordObject: ResetPassword){
    return this.httpClient.post<any>(`${this.basedURL}/rest-password`,resetPasswordObject);
  }
}
