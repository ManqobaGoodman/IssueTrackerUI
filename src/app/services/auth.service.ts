import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URLBased:string = "https://localhost:7290/api/User/";
  private userPayload: any;
  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
   }

  logIn(loginObj: any){
    return this.http.post<any>(`${this.URLBased}authenticate`,loginObj);
  }

  signIn(userObj: any){
    return this.http.post<any>(`${this.URLBased}register`,userObj);
  }

  storeToken(tokenValue:string){;
    localStorage.setItem('token',tokenValue);
  }

  storeRefreshToken(tokenValue:string){;
    localStorage.setItem('refreshToken',tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('token');
  }

  signout(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  decodedToken(){
    const jwtHelperService = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelperService.decodeToken(token);
  }

  public getRoleFromToken(){
    if (this.userPayload)
    return this.userPayload.role;
  }

  public getFullNameFromTokene(){
    if (this.userPayload)
    return this.userPayload.unique_name;
  }

  renewToken(tokenApi: TokenApiModel){
    return this.http.post<any>(`${this.URLBased}refreshToken`,tokenApi);
  }
}
