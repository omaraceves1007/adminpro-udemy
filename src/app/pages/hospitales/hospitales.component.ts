import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {
  
  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros; number = 0;
  cargando: boolean = true;
  constructor( public _hs: HospitalService,
                public _mus: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this._mus.notificacion.subscribe(
      () => this.cargarHospitales());
  }

  crearHospital() {
    swal( {
      title: 'Crear Hospital',
      text: 'Escribe el Nombre:',
      content: 'input',
      icon: 'info',
      buttons: true
    })
    .then((value) => {
      
      if (!value || value.length === 0) {
        return;
      }
      this._hs.crearHospital(value)
          .subscribe( () => {
            this.cargarHospitales();
          });
    });
  }

  cargarHospitales() {
    this._hs.cargarHospitales( this.desde )
        .subscribe( (resp: any) => {
          this.totalRegistros = resp.total;
          this.hospitales = resp.hospitales;
          this.cargando = false;
        });
  }

  cambiarDesde( valor: number ) {
    let desde = this.desde + valor;
    
    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  buscarHospital(termino: string) {
    if ( termino.length <= 0 ) {
      return;
    }

    this._hs.buscarHospital(termino)
        .subscribe( (hospitales: Hospital[]) => {
          this.hospitales = hospitales;
          this.cargando = false;
        } );

    this.cargando = true;
  }

  guardarHospital( hospital: Hospital ) {
    this._hs.actualizarHospital( hospital)
        .subscribe();
  }

  borrarHospital(hospital: Hospital) {
    
    swal( {
      title: 'Esta seguro?',
      text: 'Seguro que quiere borrar ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
      } )
      .then( ( borrar ) => {
        if (borrar) {
          this._hs.borrarHospital(hospital._id)
              .subscribe( () => {
                // console.log(borrado);
                this.cargarHospitales();
              });
        }
      } );
  }

  actualizarImagen( id: string ) {
    this._mus.mostrarModal('hospitales', id);
  }
}
