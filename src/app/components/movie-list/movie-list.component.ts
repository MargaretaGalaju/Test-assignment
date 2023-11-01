import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
} from '@angular/core';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
  takeUntil,
} from 'rxjs';

import { MovieListService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent implements OnDestroy {
  public searchValue$: Subject<string> = new Subject();

  private destroy$: Subject<boolean> = new Subject();

  constructor(
    public movieService: MovieListService,
  ) {
    this.handleSearch();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public onPageChange(page: number): void {
    this.movieService.setPage(page);
  }

  public onSearchTyping(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;

    this.searchValue$.next(searchValue);
  }

  private handleSearch(): void {
    this.searchValue$
      .asObservable()
      .pipe(
        debounceTime(400),
        map((value) => value.trim()),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchValue) => {
        this.movieService.setSearch(searchValue);
      });
  }
}
