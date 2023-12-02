import { Component, OnInit, inject } from '@angular/core';
import { AgregarProdActComponent } from 'src/app/mod-compartido/components/agregar-prod-act/agregar-prod-act.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { Product } from 'src/app/models/products.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  fireService = inject(FirebaseService)
  utilsService = inject(UtilsService)

  products: Product[] = [];
  loading: boolean = false;

  ngOnInit() {

  }

  user(): User{
    return this.utilsService.retornar('user')
  }

  ionViewWillEnter() {
    this.getProducts();
  }

 //Obtener productos
  getProducts() {
    let path = `users/${this.user().userid}/products`;

    this.loading = true;
    
    let sub = this.fireService.getDataCollection(path).subscribe({
      next: (res : any) => {
        console.log(res);
        this.products = res;

        this.loading = false;
        
        sub.unsubscribe();
      }
    })
  }

 //agregar u actualizar producto


 async AgregarProdAct(product?: Product){

  let success = await this.utilsService.presentModal({
    component: AgregarProdActComponent,
    cssClass: 'add-update-modal',
    componentProps: { product }
  })
  if (success='true') this.getProducts();
 } 


 //Confirmacion de eliminacion de producto
 async confirmDeleteProduct(product: Product) {
  this.utilsService.presentAlert({
    header: 'Eliminacion de producto',
    message: '¿estas seguro de que quieres eliminar este producto?',
    mode: 'ios',
    buttons: [
      {
        text: 'Cancelar',
      }, {
        text: 'Eliminar',
        handler: () => {
          this.deleteProduct(product);
        }
      }
    ]
  });
 }

 //Eliminar producto
 async deleteProduct(product: Product) {

  let path = `users/${this.user().userid}/products/${product.id}`

  const loading = await this.utilsService.loading();
  await loading.present();

  let imagePath = await this.fireService.getFilePath(product.image);
  await this.fireService.delFile(imagePath);

  this.fireService.delDoc(path).then(async res => {

    this.products = this.products.filter(p => p.id !== product.id)

    this.utilsService.presentToast({
      message: 'Producto eliminado con exito',
      duration: 1500,
      color: 'primary',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    })

  }).catch(error => {
    console.log(error);

    this.utilsService.presentToast({
      message: error.message,
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
