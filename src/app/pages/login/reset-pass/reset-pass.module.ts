import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPassPageRoutingModule } from './reset-pass-routing.module';

import { ResetPassPage } from './reset-pass.page';
import { ModCompartidoModule } from 'src/app/mod-compartido/mod-compartido.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPassPageRoutingModule,
    ModCompartidoModule
  ],
  declarations: [ResetPassPage]
})
export class ResetPassPageModule {}
