import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../models/cliente';
//import { CLIENTES } from './clientes.json';
import { ClienteService } from 'src/service/cliente.service';
import { ModalService } from 'src/modal/modal.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado:Cliente;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
     public modalService: ModalService, public authService: AuthService) { }

  ngOnInit() {
    //this.clientes = this.clienteService.getClientes();  sirve para asignar el arreglo local
    /*this.clienteService.getClientes().pipe(
      tap(clientes => {
        console.log('ClientesComponent: tap 3');
        clientes.forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    ).subscribe(clientes => this.clientes = clientes);*/

    //paginacion
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');//conversion de string a number
      if(!page){
        page = 0;
      }
      this.clienteService.getClientes(page)
      .pipe(
        tap(response => {
          console.log('ClientesComponent: tap 3');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          });
        })
      ).subscribe(response => {
        this.clientes = response.content as Cliente[];
        this.paginador =response;
      });
    });

    this.modalService.notificarUpload.subscribe(cliente =>{
      this.clientes = this.clientes.map(clienteOriginal =>{
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      })
    });
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estas Seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `Cliente ${cliente.nombre} eliminado con exito`,
              'success'
            )
          }
        );
      }
    })
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
