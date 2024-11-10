import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cookie } from '../../../shared/utils';
import { HttpClient } from '@angular/common/http';
import { auth } from '../../../shared/constants/apiEndpoints';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [],
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.css',
})
export class OauthCallbackComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    const provider = localStorage.getItem('oauthProvider');

    if (code && provider) {
      this.exchangeToken(code, provider);
    } else {
      console.warn('Authorization code or provider not found');
    }
  }

  private exchangeToken(code: string, provider: string) {
    const apiUrl = `${auth}/token`;

    this.http.post(apiUrl, { code, provider }).subscribe({
      next: (response: any) => {
        cookie.set({
          name: 'authToken',
          value: response.accessToken,
          hours: 24,
        });

        console.log(response);
        localStorage.removeItem('oauthProvider');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => console.error('OAuth token exchange failed:', error),
    });
  }
}

// ngOnInit() {
//   const code = this.route.snapshot.queryParamMap.get('code');
//   const provider = localStorage.getItem('oauthProvider');

//   if (code && provider) {
//     // Determine the provider callback URL
//     const apiUrl = `${auth}/authorization/${provider}`;

//     this.exchangeToken(code, apiUrl);
//   } else {
//     console.warn('Authorization code not found');
//   }
// }
// private exchangeToken(code: string, apiUrl: string) {
//   this.http.post(apiUrl, { code, provider }).subscribe({
//     next: (response: any) => {
//       cookie.set({
//         name: 'authToken',
//         value: response.accessToken,
//         hours: 24,
//       });
//       this.router.navigate(['/dashboard']);
//     },
//     error: (error) => console.error('OAuth token exchange failed:', error),
//   });
// }

// ngOnInit() {
//   const authorizationCode = this.route.snapshot.queryParamMap.get('code');
//   const provider = this.route.snapshot.queryParamMap.get('provider');
//   if (authorizationCode && provider) {
//     this.http
//       .post(`${auth}/token`, {
//         code: authorizationCode,
//         provider,
//       })
//       .subscribe(
//         (response: any) => {
//           // this.cookie.set('authToken', response.accessToken, {
//           //   expires: 1,
//           // }); // 1 day
//           console.log(response);
//           this.router.navigate(['/dashboard']);
//         },
//         (error) => {
//           console.error('OAuth login failed', error);
//         }
//       );
//   } else {
//     console.warn('Authorization code or provider not found');
//   }
// }
// }
