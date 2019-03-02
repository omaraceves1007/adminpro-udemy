import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../../models/hospital.model';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(public http: HttpClient,
              public _sas: SubirArchivoService,
              public _us: UsuarioService) { }

  cargarHospitales( desde: number = 0) {
    
    let url = `${URL_SERVICIOS}/hospital?desde=${desde}`;

    return this.http.get(url);
            // .pipe( map( (resp: any) => resp.hospitales ) );
  }

  obtenerHospital( id: string) {

    let url = `${URL_SERVICIOS}/hospital/${id}`;

    return this.http.get(url)
            .pipe( map( (resp: any) => resp.hospital ) );
  }

  borrarHospital(id: string) {

    let url = `${URL_SERVICIOS}/hospital/${id}?token=${this._us.token}`;

    return this.http.delete(url)
            .pipe( map( resp => {
              swal('Hospital borrado', 'Hospital eliminado correctamente', 'success');
              return true;
            } ) );
  }

  crearHospital(nombre: string) {
    
    let url = `${URL_SERVICIOS}/hospital?token=${this._us.token}`;
    
    return this.http.post(url, {nombre})
                .pipe( map( (resp: any) => {
                  swal('Hospital Creado', nombre, 'success');
                  return resp.hospital;
                }) );
  }

  buscarHospital( termino: string ) {

    let url = `${URL_SERVICIOS}/busqueda/hospitales/${termino}`;
    return this.http.get(url)
            .pipe( map( ( resp: any ) => resp.hospitales ));
  }

  actualizarHospital( hospital: Hospital) {
    
    let url = `${URL_SERVICIOS}/hospital/${hospital._id}?token=${this._us.token}`;

    return this.http.put( url, hospital )
              .pipe( map( ( resp: any ) => {
                swal('Hospital Actualizado', resp.hospital.nombre, 'success');
              } ) );
  }
}
