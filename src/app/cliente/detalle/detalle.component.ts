import { Component, OnInit, Input } from '@angular/core';
//import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/models/cliente';
import { ClienteService } from 'src/service/cliente.service';
import { ModalService } from 'src/modal/modal.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/service/auth.service';
import { FacturasService } from 'src/service/facturas.service';
import { Factura } from 'src/models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del Cliente";
  fotoSeleccionada: File;
  progreso:number = 0;

  constructor(private clienteService: ClienteService,public modalService: ModalService, /*private activatedRoute: ActivatedRoute*/
  public authService: AuthService, private facturasService: FacturasService) { }

  ngOnInit() {
    /*this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });*/
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image')<0){
      Swal.fire('Error Seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('Error Upload: ', 'Debe seleccionar una foto', 'error');
    }else{
    this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event =>{
      if(event.type === HttpEventType.UploadProgress){
        this.progreso = Math.round((event.loaded/event.total)*100);
      }else if(event.type === HttpEventType.Response){
        let response:any = event.body;
        this.cliente = response.cliente as Cliente;
        this.modalService.notificarUpload.emit(this.cliente);
        Swal.fire('La foto se ha subido con exito!', response.mensaje , 'success');
      }
      //this.cliente = cliente;
     
    });
  }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura:Factura): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estas Seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturasService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura);
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `Factura ${factura.descripcion} eliminada con exito`,
              'success'
            )
          }
        );
      }
    }); 
  }

}
