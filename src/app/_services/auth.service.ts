import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (window.location.hostname.toLowerCase().substr(0, 5) === 'local') { // dev local serve
      return true;
    }

    if (sessionStorage.getItem('token')) {
      return true;
    }

    this.navigateToCorporatePortalLogin();

    return false;
  }

  public isAdmin(): boolean {
    const role = sessionStorage.getItem('userRoles');
    if (role){
      // || role.includes('CorporatePortalUserServices'
      if (role.includes('CorporatePortalAdmin')){
        return true;
      }
    }
    else if (this.isTest()){
      return true;
    }
    return false;
  }

  public isTest(): boolean {
    return window.location.hostname.toLowerCase().substr(0, 5) === 'local';
  }

  public getUserId(): string {
    if (this.isTest()){
      return 'lattiia';
    }
    return sessionStorage.getItem('userId');
  }

  public navigateToCorporatePortalLogin(): void {
    const url = 'https://' + this.getEnvironment() + '/CorporatePortal/#/signin';
    window.open(url, '_self');
  }

  public navigateToCorporatePortalLanding(){
    const url = 'https://' + this.getEnvironment() + '/CorporatePortal/#/landing';
    window.open(url, '_self');
  }

  public navigateToBrowseDiscounts(){
    const url = 'https://' + this.getEnvironment() + '/EmployeeDiscount';
    window.open(url, '_self');
  }

  public getEnvironment(): string {
    let url: string;
    if (window.location.hostname.toLowerCase().substr(0, 5) === 'vlrcp') {
      url = 'vlrcp113.dpos.loc'; // prod
    } else {
      url = 'vlrct113.dpos.loc'; // test
    }
    return url;
  }
}
