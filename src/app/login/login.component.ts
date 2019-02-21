import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  email: string;
  recuerdame: boolean = false;
  auth2: any;
  
  constructor( public router: Router, public _us: UsuarioService) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }

  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '561993401588-p1q8j0ss6in0035pjc59pundmsts896d.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin( document.getElementById('btnGoogle') );
    });
  }

  attachSignin ( element ) {
    this.auth2.attachClickHandler( element, {}, googleUser => {
      // let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;

      this._us.loginGoogle( token )
            .subscribe( resp => {
              // this.router.navigate(['/dashboard']);
              window.location.href = '#/dashboard';
            });
      console.log(token);      
    } );
  }

  ingresar( forma: NgForm ) {
  
    if ( forma.invalid ) {
      return;
    }

    let usuario = new Usuario(null, forma.value.email, forma.value.password );

    this._us.login(usuario, forma.value.recuerdame)
            .subscribe( resp => this.router.navigate(['/dashboard']) );
  }

}
