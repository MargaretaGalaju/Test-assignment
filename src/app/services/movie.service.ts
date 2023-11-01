import { Injectable } from '@angular/core';

import { MovieListState } from '../interfaces/movie-list-state.interface';
import { Paginator } from '../interfaces/paginator.interface';
import { BehaviorSubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { Movie } from '../interfaces/movie.interface';
import { MovieApiService } from './movie-api.service';
import { MessageService } from 'primeng/api';

const MAX_PAGES_LIMIT_NUMBER = 500;

@Injectable({
  providedIn: 'root',
})
export class MovieListService {
  public movies$: BehaviorSubject<Movie[]> = new BehaviorSubject([] as Movie[]);
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public paginator: Paginator = {
    rows: 20,
    totalRecords: 0,
    first: 1,
    currentPage: 1,
  };
  
  private movieListState: MovieListState = {
    page: 1,
    search: ''
  };
  private movieOptions$: BehaviorSubject<MovieListState> = new BehaviorSubject(this.movieListState);

  constructor(
    private apiService: MovieApiService,
    private messageService: MessageService
  ) {
    this.retreiveMovies();
  }

  public setPage(newPage: number): void {
    this.paginator.currentPage = (newPage ?? 0) + 1;
    this.movieListState.page = newPage;
    this.movieOptions$.next(this.movieListState)
  }

  public setSearch(searchValue: string): void {
    this.movieListState.page = 1;
    this.movieListState.search = searchValue;
    this.movieOptions$.next(this.movieListState)
  }

  public retreiveMovies(): void {
    this.movieOptions$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(({ page, search }) =>
        search
          ? this.apiService.searchByKeyword(page, search)
          : this.apiService.fetchMovieList(page)
      ),
      map((data) => {
        this.paginator = {
          ...this.paginator,
          rows: data?.results?.length,
          // Correct would be: totalRecords: data.total_pages,
          // But the API has a limit set of 500 pages (access the first 500 pages only), data?.results?.length are items per page
          totalRecords:
            data.total_pages > MAX_PAGES_LIMIT_NUMBER
              ? data?.results?.length * MAX_PAGES_LIMIT_NUMBER
              : data.total_pages,
        };

        this.paginator.first = (this.paginator.currentPage - 1) * this.paginator.rows;

        this.loading$.next(false);
        return data.results;
      }),
      catchError(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: 'An error occured',
        });

        this.loading$.next(false);

        return of([]);
      })
    ).subscribe((movies) => {
      this.movies$.next(movies);
    });
  }
}
