import { UserAuth } from '@/models/user-auth';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
import { SuccessResponse  } from '@/dtos/common/success-response';
import { post } from '@/api/request';
import { log, time } from 'console';
import { getTokenInfo } from '@/utils/token';
import CacheKey from '@/constants/cache-key';

export class AuthService {
  private authTemplate: string = '/api/v1/auth';
  private refreshTokenTimeout?: NodeJS.Timeout;
  constructor() {

  }
  login({ username, password }: any) {
    return post<UserAuth>(`${this.authTemplate}/login`,
        {
          username,
          password,
          platform: "Web",
          browser: this.detectBrowserName(),
          site:0
        })
  }

  oktaLogin(oktaAccountId: string, accessToken: string) {
    return post<UserAuth>(
        `${this.authTemplate}/login/okta`,
        {
          oktaAccountId,
          accessToken,
          platform: "Web",
          browser: this.detectBrowserName(),
        }
      )
  }

  // changePassword({ username, oldPassword, newPassword, confirmPassword }: any) {
  //   return this.httpClient.post<SuccessResponse>(
  //     `${environment.apiUrl}${this.authTemplate}/change-password`,
  //     {
  //       username,
  //       oldPassword,
  //       newPassword,
  //       confirmPassword,
  //     }
  //   );
  // }

  // resetPassword(
  //   username: string,
  //   password: string,
  //   isForceChangePassword: boolean
  // ) {
  //   return this.httpClient.post<SuccessResponse>(
  //     `${environment.apiUrl}${this.authTemplate}/${username}/reset-password`,
  //     {
  //       password,
  //       isForceChangePassword,
  //     }
  //   );
  // }

  async refreshToken(refreshToken:string) {
    return await post<UserAuth>(
        `${this.authTemplate}/refresh`,
        { refreshToken },
    )
  }

  logout() {
    return post<any>(
        `${this.authTemplate}/logout`,
        {},
      );
  }


  detectBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'Edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'Opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'Chrome';
      case agent.indexOf('trident') > -1:
        return 'IE';
      case agent.indexOf('firefox') > -1:
        return 'FireFox';
      case agent.indexOf('safari') > -1:
        return 'Safari';
      default:
        return 'Other';
    }
  }
}
