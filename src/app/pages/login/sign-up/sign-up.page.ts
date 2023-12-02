import { Injectable, inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    userid : new FormControl(''),
    email : new FormControl('',[Validators.required, Validators.email]),
    password : new FormControl('',[Validators.required]),
    name : new FormControl('',[Validators.required, Validators.minLength(4)])
  })

  fireService = inject(FirebaseService)
  utilsService = inject(UtilsService)

  ngOnInit() {
  }

  async submit(){
    if (this.form.valid){

      const loading = await this.utilsService.loading();
      await loading.present();

      this.fireService.signUp(this.form.value as User).then(async res =>{

        await this.fireService.updateUser(this.form.value.name);

        let userid = res.user.uid;
        this.form.controls.userid.setValue(userid);

        this.setUser(userid);

        console.log(res);

      }).catch(error => {
        console.log(error);

        this.utilsService.presentToast({
          message: 'Error al registrarse',
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

  async setUser(userid: string){
    if (this.form.valid){

      const loading = await this.utilsService.loading();
      await loading.present();

      let path = 'users/$(userid)';
      delete this.form.value.password;

      this.fireService.setDoc(path, this.form.value).then(async res =>{

        this.utilsService.guardar('user', this.form.value);
        
        this.utilsService.routerLink('/main/home');
        this.form.reset();


      }).catch(error => {
        console.log(error);

        this.utilsService.presentToast({
          message: 'Error al registrarse',
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
