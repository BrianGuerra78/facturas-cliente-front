import { Component } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
 title: string = 'App Angular';

 constructor(public authService: AuthService, private router: Router){}

 logout():void{
  let username = this.authService.usuario.username;
  this.authService.logout();
  Swal.fire('Logout',`Hola ${username}, ha cerrado sesion con exito`, 'success');
  this.router.navigate(['/login']);
 }
}
