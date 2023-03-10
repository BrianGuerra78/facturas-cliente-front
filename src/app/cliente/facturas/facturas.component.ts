import { Component, OnInit } from '@angular/core';
import { Factura } from 'src/models/factura';
import { ClienteService } from 'src/service/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, mergeMap } from 'rxjs';
import { map, flatMap } from 'rxjs';
import { FacturasService } from 'src/service/facturas.service';
import { Producto } from 'src/models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from 'src/models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit{

  titulo:string = 'Nueva Factura';
  factura:Factura = new Factura();

  autocompleteControl = new FormControl('');
  //productos: string[] = ['Mesa', 'Tablet', 'Sony', 'Samsung', 'Tv LG', 'Bicicleta'];
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute,
    private router: Router, private facturasService: FacturasService){}

  ngOnInit(){
    this.activatedRoute.paramMap.subscribe(params =>{
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map((value:any) => typeof value ==='string'? value: value.nombre),
      mergeMap(value => value ? this._filter(value || ''): []),
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturasService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto):string | undefined{
    return producto? producto.nombre: undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void{
    let producto = event.option.value as Producto;
    console.log(producto);

    if(this.existeItem(producto.id)){
      this.incrementaCantidad(producto.id);
    }else{
    let nuevoItem = new ItemFactura();
    nuevoItem.producto = producto;
    this.factura.items.push(nuevoItem);
    }
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id:number, event:any): void{
    let cantidad:number = event.target.value as number;
    if(cantidad==0){
     return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id:number):boolean{
    let existe = false;
    this.factura.items.forEach((item: ItemFactura)=>{
      if(id === item.producto.id){
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id:number):void{
    this.factura.items = this.factura.items.map((item:ItemFactura)=>{
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number):void{
    this.factura.items = this.factura.items.filter((item: ItemFactura)=> id !== item.producto.id);
  }

  create():void{
    console.log(this.factura);
    this.facturasService.create(this.factura).subscribe(factura =>{
      this.router.navigate(['/facturas', factura.id]);
      Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con exito!`, 'success');
    });
  }
}
