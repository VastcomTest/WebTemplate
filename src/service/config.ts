// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { SuccessResponse } from '@core/dtos/common/success-response';
// import { Config } from '@core/interfaces/config';
// import { OktaConfig } from '@core/interfaces/okta-config';
// import { SettingValue } from '@core/models/setting-value';
// import { environment } from '@env/environment';
// import { BehaviorSubject, Observable, map, pipe } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ConfigService {

  
//   private configTemplate: string = '/api/v1/config';

//   private config: any;
//   private oktaConfigSubject: BehaviorSubject<OktaConfig | null>;

//   constructor(private httpClient: HttpClient) {
//     this.oktaConfigSubject = new BehaviorSubject<OktaConfig | null>(null);
//   }

//   public get oktaConfigValue(): OktaConfig | null {
//     return this.oktaConfigSubject.value;
//   }

//   loadConfig(): Observable<any> {
//     return this.httpClient.get('/assets/config/config.json');
//   }

//   setConfig(config: any): void {
//     this.config = config;
//   }

//   getAppName(): any {
//     return this.config.appName;
//   }


//   getOktaConfigs(): Observable<OktaConfig | null> {
//     return this.httpClient.get<Config>(`${environment.apiUrl}${this.configTemplate}/okta`).pipe(
//       map((res: Config) => {
        
//         const clientId = res.settings.find((config) => config.key === 'Okta.ClientId')?.value;
//         const domain = res.settings.find((config) => config.key === 'Okta.Domain')?.value;
//         const redirectUri = res.settings.find((config) => config.key === 'Okta.RedirectUri')?.value;

//         if (clientId && domain && redirectUri) {
//           const oktaConfig: OktaConfig = {
//             clientId,
//             domain,
//             redirectUri,
//             enabled: res.enabled,
//           };
//           this.oktaConfigSubject.next(oktaConfig);
//           return oktaConfig;
//         }

//         this.oktaConfigSubject.next(null);
//         return null;
//       })
//     );
//   }

//   getConfig(name: string): Observable<Config> {
//     return this.httpClient.get<Config>(`${environment.apiUrl}${this.configTemplate}/${name}`);
//   }

//   toggleConfig(id: number, enabled: boolean): Observable<any> {
//     return this.httpClient.patch<SuccessResponse>(`${environment.apiUrl}${this.configTemplate}/${id}/toggle/${enabled}`, {});
//   }

//   updateConfig(configId: number, settingValues: SettingValue[]): Observable<any> {
//     return this.httpClient.put<SuccessResponse>(`${environment.apiUrl}${this.configTemplate}/${configId}`, { settingValues });
//   }
// }
