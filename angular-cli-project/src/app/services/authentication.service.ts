import { Injectable }               from '@angular/core';
import { Http, Headers, Response }  from '@angular/http';
import { Router }                   from '@angular/router';
import { Observable }               from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  public token: string;

  constructor(private http: Http, private router: Router) {
    // set token if saved in local storage
    let auth_token = JSON.parse(localStorage.getItem('auth_token'));
    this.token = auth_token && auth_token.token;
  }

  login(email, pass): Observable<boolean> {
    return this.http.post('/api/authenticate', JSON.stringify({ email: email, pass: pass }))
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token = response.json() && response.json().token;
        if (token) {
          // set token property
          this.token = token;

          // store email and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('auth_token', JSON.stringify({ email: email, token: token }));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      });
  }

  logout(): void {
    // clear token remove user from local storage to log user out and navigates to welcome page
    this.token = null;
    localStorage.removeItem('auth_token');
    this.router.navigate(['']);
  }

  checkCredentials() {
    if (!this.isLoggedIn()) {
      this.logout();
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('auth_token');
  }
}