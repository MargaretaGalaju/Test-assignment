import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetailedMovie, MoviesHttpResponse } from '../interfaces/movie.interface';


@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private readonly httpClient: HttpClient) {}

  public searchByKeyword(
    page: number,
    search: string
  ): Observable<MoviesHttpResponse> {
    let params = new HttpParams()
      .set('language', 'en-US')
      .set('page', page.toString())
      .set('query', search);

    return this.httpClient.get<MoviesHttpResponse>(
      'https://api.themoviedb.org/3/search/movie',
      { params }
    )
  }

  public fetchMovieList(page: number): Observable<MoviesHttpResponse> {
    let params = new HttpParams()
      .set('language', 'en-US')
      .set('page', page.toString());

    return this.httpClient.get<MoviesHttpResponse>(
      'https://api.themoviedb.org/3/movie/popular',
      { params }
    );
  }

  public fetchMovie(id: string): Observable<DetailedMovie> {
    return this.httpClient.get<DetailedMovie>(
      `https://api.themoviedb.org/3/movie/${id}`
    );
  }
}
