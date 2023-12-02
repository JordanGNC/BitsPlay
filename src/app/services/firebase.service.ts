import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from '@angular/fire/storage'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore)
  storage = inject(AngularFireStorage)
  utilsService = inject(UtilsService)



  //Autentificacion de usuario
  getAuth() {
    return getAuth();
  }

  //Cerrar sesion
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/login')
  }

  //Iniciar sesion
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }


  //Creacion de usuario
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //Cambio de contraseña
  sendEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  //Actualizacion de usuario
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  //Data base

  //Obtener documentos de una colección
  getDataCollection(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path)
    return collectionData(query(ref, collectionQuery), { idField: 'id' })
  }

  //Setear documento
  setDoc(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //Actualizar documento
  ActDoc(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //borrar documento
  delDoc(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  //Obtener documento
  async getDoc(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //Agregar documento
  addDoc(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);
  }

  //Almacenamiento

  //Subir imagen
  async subirImg(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  //Obtener ruta de la imagen junto con su URL
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath
  }

  //Eliminar archivo
  delFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }

}



