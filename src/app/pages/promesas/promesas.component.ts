import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {
    
    let promesa = this.contarTres();

    promesa.then( mensaje => console.log('Termino', mensaje))
            .catch( error => console.error('Error', error)
     );

   }

  ngOnInit() {
  }

  contarTres(): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      
      let contador = 0;
      
      let intervalo = setInterval( () => {
          contador += 1;
          if ( contador === 3) {
              // reject(false);
              resolve(true);
              clearInterval(intervalo);
          }
        }, 1000 );
    } );
  }
    
}
