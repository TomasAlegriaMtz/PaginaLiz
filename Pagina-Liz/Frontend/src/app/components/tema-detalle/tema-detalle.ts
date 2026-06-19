import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-tema-detalle',
  imports: [],
  templateUrl: './tema-detalle.html',
  styleUrl: './tema-detalle.css',
})
export class TemaDetalle {
  @Input() listaTemas: string[] = [];
}
