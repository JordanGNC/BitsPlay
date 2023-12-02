import { Injectable, inject, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/products.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  fireService = inject(FirebaseService)
  utilsService = inject(UtilsService)

  ngOnInit() {
  }

  user(): User{
    return this.utilsService.retornar('user')
  }

  //Seleccionar imagen de perfil
  async takeImage() {

    let user = this.user();
    let path = `users/${user.userid}`;

    const loading = await this.utilsService.loading();
    await loading.present();

    const dataUrl = (await this.utilsService.takePicture('imagen del perfil')).dataUrl;

    let imagePath = `${user.userid}/profile`;
    user.image = await this.fireService.subirImg(imagePath, dataUrl);

    this.fireService.ActDoc(path, {image : user.image}).then(async res => {

      this.utilsService.guardar('user', user);

      this.utilsService.presentToast({
        message: 'Imagen de perfil actualizada con exito',
        duration: 1500,
        color: 'primary',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);

      this.utilsService.presentToast({
        message: 'Error al cambiar imagen del perfil',
        duration: 3000,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss();
    })
  }

}
