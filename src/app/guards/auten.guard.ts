import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})

export class AutenGuard implements CanActivate {

  fireService = inject(FirebaseService)
  utilsService = inject(UtilsService)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      let user = localStorage.getItem('user')
    
    return new Promise((resolve) => {
      
      this.fireService.getAuth().onAuthStateChanged((auth) =>{

        if(auth){
          resolve(true)
        }
        else{
          this.utilsService.routerLink('/login');
          resolve(false);
        }
      })
    })
  }
  
}
