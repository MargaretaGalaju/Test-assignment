import { Component, Input } from '@angular/core';

import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieComponent {
  @Input()
  public movie!: Movie;
}
