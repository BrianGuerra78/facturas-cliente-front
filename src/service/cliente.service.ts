import { Injectable } from '@angular/core';
import { Cliente } from 'src/models/cliente';
import { Region } from 'src/models/region';
//import { CLIENTES } from 'src/app/cliente/clientes/clientes.json';
//import { DatePipe, formatDate ,registerLocaleData} from '@angular/common';
//import localeES from '@angular/common/locales/es-MX';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs';
//import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/API/clientes';
  /*private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });*/

  constructor(private http: HttpClient, private router: Router, /*private authService: AuthService*/) { }

  /*private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }*/

  /*private isNoAutorizado(e): boolean{
    if (e.status == 401) {
      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }

    if (e.status == 403) {
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tiene permisos de administrador!`, 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }*/

  /* getRegiones(): Observable<Region[]> {
     return this.http.get<Region[]>(this.urlEndPoint + '/regiones', {headers: this.agregarAuthorizationHeader()}).pipe(
       catchError(e =>{
         this.isNoAutorizado(e);
         return throwError(e);
       })
     );
   }*/

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  /*getClientes(): Cliente[]{
    return CLIENTES;
  }*///sirve para leer un arreglo local
  /*getClientes(): Observable<Cliente[]> {
    return this.http.get(this.urlEndPoint).pipe(
      tap(response => {
        let clientes = response as Cliente[];
        console.log('ClienteService: tap 1');
        clientes.forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
      map(response => {
        let clientes = response as Cliente[];
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //registerLocaleData(localeES,'es-MX');
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
          return cliente;
        });
      }
      ),
      tap(response => {
        console.log('ClienteService: tap 2');
        response.forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    );
  }*/
  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente /*, { headers: this.agregarAuthorizationHeader() }*/)
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {

          /* if(this.isNoAutorizado(e)){
             return throwError(e);
           }*/

          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          //Swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}` /*, { headers: this.agregarAuthorizationHeader() }*/).pipe(
      catchError(e => {
        /*if(this.isNoAutorizado(e)){
          return throwError(e);
        }*/
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        //Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente /*, { headers: this.agregarAuthorizationHeader() }*/).pipe(
      catchError(e => {

        /*if(this.isNoAutorizado(e)){
          return throwError(e);
        }*/

        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        //Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}` /*, { headers: this.agregarAuthorizationHeader() }*/).pipe(
      catchError(e => {
        /*if(this.isNoAutorizado(e)){
          return throwError(e);
        }*/
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        //Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    /*let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }*/

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, { reportProgress: true /*, headers: httpHeaders*/ });

    return this.http.request(req);
    /* return this.http.request(req).pipe(
      catchError(e =>{
        this.isNoAutorizado(e);
        return throwError(e);
      })
    ); */
    /*.pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );*/
  }

}