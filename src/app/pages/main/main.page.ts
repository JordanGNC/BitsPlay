import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    {title: 'Inicio', url: 'home', icon: 'home-outline'},
    {title: 'perfil', url: 'profile', icon: 'person-outline'}
  ]

  router = inject(Router);
  fireService = inject(FirebaseService)
  utilsService = inject(UtilsService)

  ngOnInit() {
  }

  user(): User{
    return this.utilsService.retornar('user')
  }

//Cerrar sesion
  signOut() {
    this.fireService.signOut();
  }
}
