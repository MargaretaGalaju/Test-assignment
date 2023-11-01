import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';

import { Movie } from '../../interfaces/movie.interface';
import { MovieService } from '../../services/movie.service';
import { Paginator } from '../..//interfaces/paginator.interface';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent implements OnInit, OnDestroy {
  public movies$: Observable<Movie[]> = new Observable();
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  public paginator: Paginator = {
    rows: 0,
    totalRecords: 0,
    currentPage: 0,
  };

  private searchValue$: Subject<string> = new Subject();
  private destroy$: Subject<boolean> = new Subject();
  private movieOptions$: BehaviorSubject<{
    search: string;
    page: number;
  }> = new BehaviorSubject({ search: '', page: 1 });

  constructor(
    private movieService: MovieService,
    private messageService: MessageService,
  ) {
    this.handleSearch();
  }

  public ngOnInit(): void {
    this.movies$ = this.movieOptions$.pipe(
      switchMap(({ page, search }) =>
        search
          ? this.movieService.searchByKeyword(page, search)
          : this.movieService.fetchMovieList(page)
      ),
      map((data) => {
        this.paginator = {
          ...this.paginator,
          rows: data?.results?.length,
          // Correct would be:
          // totalRecords: data.total_pages,
          // But the API has a limit set of 500 pages (access the first 500 pages only), data?.results?.length are items per page
          totalRecords:
            data.total_pages > 500
              ? data?.results?.length * 500
              : data.total_results,
        };

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
    );
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public onPageChange(page?: number): void {
    this.loading$.next(true);

    this.paginator = {
      ...this.paginator,
      currentPage: (page ?? 0) + 1,
    };

    this.movieOptions$.next({
      ...this.movieOptions$.getValue(),
      page: this.paginator.currentPage,
    });
  }

  public onSearchTyping(event: any): void {
    const searchValue = event.target.value;

    this.searchValue$.next(searchValue);
  }

  private handleSearch(): void {
    this.searchValue$
      .asObservable()
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchValue) => {
        this.loading$.next(true);
        this.paginator = {
          ...this.paginator,
          currentPage: 1,
        };

        this.movieOptions$.next({
          page: this.paginator.currentPage,
          search: searchValue,
        });
      });
  }
}
