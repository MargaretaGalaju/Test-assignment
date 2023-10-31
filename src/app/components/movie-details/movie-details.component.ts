import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, first, map, switchMap, tap } from 'rxjs';
import { DetailedMovie, Movie } from 'src/app/interfaces/movie.interface';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent {
  public movie$: Observable<DetailedMovie>;
  public movieConfig: {
    title: string;
    key: string;
  }[] = [];

  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
  ) {
    this.movie$ = this.activatedRoute.params.pipe(
      first(),
      switchMap((params) => this.movieService.fetchMovie(params['id'])),
      map((movie) => ({
        ...movie,
        genresList: movie.genres.map((genre) => genre.name).join(', '),
      })),
    );
  }
}
