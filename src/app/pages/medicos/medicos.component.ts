import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  cargando: boolean = true;
  totalRegistros: number = 0;
  desde: number = 0;
  medicos: Medico[] = [];

  constructor( public _ms: MedicoService,
                public _mus: ModalUploadService) { }

  ngOnInit() {
    this.cargarMedicos(this.desde);
  }

  cargarMedicos( desde: number ) {
    this._ms.cargarMedicos(desde)
        .subscribe( (resp: any) => {
          this.medicos = resp.medicos;
          this.totalRegistros = resp.total;
          this.cargando = false;
        } );
  }

  buscarMedico(termino: string) {
    if ( termino.length <= 0 ) {
      this.cargarMedicos(this.desde);
      return;
    }
    this.cargando = true;

    this._ms.buscarMedico(termino)
        .subscribe( ( medicos: Medico[] ) => {
          this.medicos = medicos;
          this.cargando = false;
        } );
  }

  actualizarImagen( id: string ) {
    this._mus.mostrarModal('medicos', id);
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
    this.cargarMedicos( this.desde);
  }

  borrarMedico(medico: Medico) {
    swal( {
      title: 'Esta seguro?',
      text: 'Seguro que quiere borrar ' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
      } )
      .then( ( borrar ) => {
        if (borrar) {
          this._ms.borrarMedico(medico._id)
              .subscribe( () => {
                this.cargarMedicos( this.desde );
              });
        }
      } );
  }
}
