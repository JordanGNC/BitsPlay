import { Injectable, inject, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/products.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar-prod-act',
  templateUrl: './agregar-prod-act.component.html',
  styleUrls: ['./agregar-prod-act.component.scss'],
})
export class AgregarProdActComponent implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)])
  })

  fireService = inject(FirebaseService)
  utilsService = inject(UtilsService)

  user = {} as User;

  ngOnInit() {

    this.user = this.utilsService.retornar('user');
    if (this.product) this.form.setValue(this.product)
  }

  //Seleccionar imagen
  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('imagen del producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl)
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.UpdateProduct();
      else this.CreateProduct()
    }
  }
  //Crear producto
  async CreateProduct() {

    let path = `users/${this.user.userid}/products`

    const loading = await this.utilsService.loading();
    await loading.present();

    //subir imagen y obtener su url
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.userid}/${Date.now()}`;
    let imageUrl = await this.fireService.subirImg(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.fireService.addDoc(path, this.form.value).then(async res => {

      this.utilsService.dismissModal({ success: true });

      this.utilsService.presentToast({
        message: 'Producto agregado con exito',
        duration: 1500,
        color: 'primary',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

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
  //Actualizar producto
  async UpdateProduct() {

    let path = `users/${this.user.userid}/products/${this.product.id}`

    const loading = await this.utilsService.loading();
    await loading.present();

    //cambio imagen, subir nueva imagen y obtener su url
    if(this.form.value.image !== this.product.image){
      let dataUrl = this.form.value.image;
      let imagePath = await this.fireService.getFilePath(this.product.image);
      let imageUrl = await this.fireService.subirImg(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }
    

    delete this.form.value.id;

    this.fireService.ActDoc(path, this.form.value).then(async res => {

      this.utilsService.dismissModal({ success: true });

      this.utilsService.presentToast({
        message: 'Producto actualizado con exito',
        duration: 1500,
        color: 'primary',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

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
