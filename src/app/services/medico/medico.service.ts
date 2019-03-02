import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';
import { Medico } from 'src/app/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( public http: HttpClient,
                public _sas: SubirArchivoService,
                public _us: UsuarioService) { }

  cargarMedicos( desde: number = 0) {
    
    let url = `${URL_SERVICIOS}/medico?desde=${desde}`;

    return this.http.get( url );
  }

  buscarMedico( termino: string ) {

    let url = `${URL_SERVICIOS}/busqueda/medicos/${termino}`;

    return this.http.get(url)
            .pipe( map( ( resp: any ) => resp.medicos ));
  }

  borrarMedico( id: string ) {
    
    let url = `${URL_SERVICIOS}/medico/${id}?token=${this._us.token}`;

    return this.http.delete(url)
            .pipe( map( (resp: any) => {
              swal('Médico borrado', 'Médico ' + resp.medico.nombre + ' eliminado correctamente', 'success');
              return true;
            }) );
  }

  guardarMedico( medico: Medico ) {
    
    let url = `${URL_SERVICIOS}/medico`;

    if (medico._id) {
      url += `/${medico._id}?token=${this._us.token}`;
      return this.http.put(url, medico)
            .pipe( map( (resp: any) => {
              swal('Médico Actualizado', resp.medico.nombre + ' se actualizo correctamente', 'success');
              return resp.medico;
            } ) );
    } else {
      url += `?token=${this._us.token}`;
      return this.http.post(url, medico)
      .pipe( map( (resp: any) => {
        swal('Médico creado', resp.medico.nombre + ' creado correctamente', 'success');
        return resp.medico;
      }) ); 
    }
  }

  cargarMedico( id: string ) {

    let url = `${URL_SERVICIOS}/medico/${id}`;

    return this.http.get(url)
          .pipe( map( (resp: any) => resp.medico ) );
  }
}
