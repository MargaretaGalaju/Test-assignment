import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, first, map, of, switchMap } from 'rxjs';

import { DetailedMovie } from '../../interfaces/movie.interface';
import { MovieApiService } from '../../services/movie-api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent {
  public movie$: Observable<DetailedMovie>;

  constructor(
    private apiService: MovieApiService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.movie$ = this.activatedRoute.params.pipe(
      first(),
      switchMap((params) => this.apiService.fetchMovie(params['id'])),
      map((movie) => ({
        ...movie,
        genresList: movie.genres.map((genre) => genre.name).join(', '),
      })),
      catchError(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid movie id',
          detail: 'Movie with such an id doesn\'t exist',
        });
        this.router.navigate(['']);

        return of();
      }),
    );
  }
}
