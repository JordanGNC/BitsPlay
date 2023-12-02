import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertOptions, AlertController, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

 loadCtrl = inject(LoadingController);
 toastCtrl = inject(ToastController);
 router = inject(Router);
 modalCtrl = inject(ModalController);
 alertCtrl = inject(AlertController)

//Foto
async takePicture(promptLabelHeader: string) {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Photos,
    promptLabelHeader,
    promptLabelPhoto: 'Selecione una imagen'
  })
};

//Alert
async presentAlert(opts?: AlertOptions) {
  const alert = await this.alertCtrl.create(opts);

  await alert.present();
}

//Loading
  loading(){
    return this.loadCtrl.create({spinner: 'crescent'});
  }

//Toast
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

//Enrutador
  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

//Guardar en el storage
  guardar(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }  

//Retornar de el storage
  retornar(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

//modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if(data) return data
  
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss()
  }
}
