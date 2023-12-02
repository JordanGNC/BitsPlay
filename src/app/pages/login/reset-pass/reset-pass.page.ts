import { Injectable, inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.page.html',
  styleUrls: ['./reset-pass.page.scss'],
})
export class ResetPassPage implements OnInit {

  form = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email])
  })

  fireService = inject(FirebaseService)
  utilsService = inject(UtilsService)

  ngOnInit() {
  }

  async submit(){
    if (this.form.valid){

      const loading = await this.utilsService.loading();
      await loading.present();

      this.fireService.sendEmail(this.form.value.email).then(res =>{

        this.utilsService.presentToast({
          message: 'Se te ha enviado un correo para recuperar tu contraseña',
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        });

        this.utilsService.routerLink('/login');
        this.form.reset();

      }).catch(error => {
        console.log(error);

        this.utilsService.presentToast({
          message: 'No existe una cuenta con ese correo',
          duration: 3000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });

      }).finally(() => {
        loading.dismiss();
      })
    }      
  }

}
