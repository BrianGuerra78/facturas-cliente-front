import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './cliente/clientes/clientes.component';
import { ClienteService } from 'src/service/cliente.service';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormClienteComponent } from './cliente/form-cliente/form-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeES from '@angular/common/locales/es-MX';
import { registerLocaleData} from '@angular/common';
import { PaginatorComponent } from './cliente/paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DetalleComponent } from './cliente/detalle/detalle.component';
import { LoginComponent } from './usuarios/login/login.component';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { TokenInterceptor } from 'src/interceptors/token.interceptor';
import { AuthInterceptor } from 'src/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './cliente/detalle-factura/detalle-factura.component';
import { FacturasComponent } from './cliente/facturas/facturas.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

  registerLocaleData(localeES,'es-MX');
const routes: Routes =[
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'clientesForm', component: FormClienteComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'clientesForm/:id', component: FormClienteComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'login', component: LoginComponent},
  {path: 'facturas/:id', component: DetalleFacturaComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'facturasForm/:clienteId', component: FacturasComponent, canActivate:[AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}}
  //{path: 'clientes/detalle/:id', component: DetalleComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormClienteComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [ClienteService, 
  {provide: LOCALE_ID, useValue: 'en-MX'},
  {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
