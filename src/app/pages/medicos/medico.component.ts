import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService } from '../../services/service.index';
import { HospitalService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';
import { Router,ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor( public _ms: MedicoService,
                public _hs: HospitalService,
                public _mus: ModalUploadService,
                public router: Router,
                public activateRoute: ActivatedRoute) {
  activateRoute.params.subscribe( params => {
    let id = params['id'];
    if (id !== 'nuevo') {
      this.cargarMedico(id);
    }
  } );
                 }

  ngOnInit() {
    this._hs.cargarHospitales( 0 )
        .subscribe( (resp: any) => {
          this.hospitales = resp.hospitales;
        });
        this._mus.notificacion.subscribe( resp => {
          this.medico.img = resp.medico.img;
        });
  }
  
  cargarMedico(id: string) {
    this._ms.cargarMedico(id)
        .subscribe( medico => {
          this.medico = medico;
          this.medico.hospital = medico.hospital._id;
          this.cambioHospital(this.medico.hospital);
        } );
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return;
    }
    this._ms.guardarMedico( this.medico )
        .subscribe( ( medico: any ) => {
          this.medico._id = medico._id;
          this.router.navigate(['/medico', medico._id]);
        });
  }

  cambioHospital(id: string) {
    
    this._hs.obtenerHospital(id)
        .subscribe( hospital => this.hospital = hospital );
    
  }

  cambiarFoto() {
    this._mus.mostrarModal('medicos', this.medico._id);
  }

}
