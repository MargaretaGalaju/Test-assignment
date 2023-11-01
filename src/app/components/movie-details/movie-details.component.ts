import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, first, map, switchMap } from 'rxjs';

import { DetailedMovie } from '../../interfaces/movie.interface';
import { MovieApiService } from '../../services/movie-api.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent {
  public movie$: Observable<DetailedMovie>;

  constructor(
    private apiService: MovieApiService,
    private activatedRoute: ActivatedRoute
  ) {
    this.movie$ = this.activatedRoute.params.pipe(
      first(),
      switchMap((params) => this.apiService.fetchMovie(params['id'])),
      map((movie) => ({
        ...movie,
        genresList: movie.genres.map((genre) => genre.name).join(', '),
      })),
    );
  }
}
