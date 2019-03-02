import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  

  imagenSubir: File;
  imagenTemp: any;

  constructor( public _sas: SubirArchivoService,
                public _mus: ModalUploadService ) {
   }

  ngOnInit() {
  }

  cerrarModal() { 
    this.imagenSubir = null;
    this.imagenTemp = null;
    this._mus.ocultarModal();
  }

  seleccionImagen( archivo: File ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') > 0 ) {
      swal('Solo Imagenes', 'El archivo Seleccionado no es una imagen' , 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );
    
    
    reader.onloadend = () => this.imagenTemp = reader.result;
    
  }

  subirImagen() {
    this._sas.subirArchivo( this.imagenSubir, this._mus.tipo, this._mus.id )
        .then( res => {
          this._mus.notificacion.emit( res );
          this.cerrarModal();
        } )
        .catch( err => {
          console.log('Error de carga', err);
        });
  }

}
