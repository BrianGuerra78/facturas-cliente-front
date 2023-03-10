import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent {

  listaCurso: string[] = ['TypeScript', 'JavaScript', 'Java SE', 'C#', 'PHP'];

  habiitar: boolean = true;

  constructor(){}

  setHabilitar(): void{
    this.habiitar = (this.habiitar==true)? false: true;
  }
}
