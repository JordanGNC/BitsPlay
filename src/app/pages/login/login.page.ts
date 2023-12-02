import { Injectable, inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    email : new FormControl('',[Validators.required, Validators.email]),
    password : new FormControl('',[Validators.required])
  })

  fireService = inject(FirebaseService)
  utilsService = inject(UtilsService)

  ngOnInit() {
  }

  async submit(){
    if (this.form.valid){

      const loading = await this.utilsService.loading();
      await loading.present();

      this.fireService.signIn(this.form.value as User).then(res =>{

        this.getUser(res.user.uid)

      }).catch(error => {
        console.log(error);

        this.utilsService.presentToast({
          message: 'Error al iniciar sesion, verifique si su email o contraseña son correctos',
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

  async getUser(userid: string){
    if (this.form.valid){

      const loading = await this.utilsService.loading();
      await loading.present();

      let path = 'users/$(userid)';

      this.fireService.getDoc(path).then( (user: User) =>{

        this.utilsService.guardar('user', user);
        
        this.utilsService.routerLink('/main/home');
        this.form.reset();

        this.utilsService.presentToast({
          message: `Bienvenido ${user.name}`,
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        })


      }).catch(error => {
        console.log(error);

        this.utilsService.presentToast({
          message: 'Error al iniciar sesion',
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

}
