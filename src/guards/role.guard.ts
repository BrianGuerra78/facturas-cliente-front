import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/service/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }
      let role= route.data['role'] as string;
      console.log(role);
      if(this.authService.hasRole(role)){
        return true;
      }
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tiene permisos de administrador!`, 'warning');
      this.router.navigate(['/clientes']);
    return false;
  }
  
}
