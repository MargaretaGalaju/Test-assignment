import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DetailedMovie, MoviesHttpResponse } from '../interfaces/movie.interface';


@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private static baseUrl = 'https://api.themoviedb.org/3'
  
  constructor(private readonly httpClient: HttpClient) {}

  public searchByKeyword(
    page: number,
    search: string
  ): Observable<MoviesHttpResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('query', search);

    return this.httpClient.get<MoviesHttpResponse>(
      `${MovieService.baseUrl}/search/movie`,
      { params }
    )
  }

  public fetchMovieList(page: number): Observable<MoviesHttpResponse> {
    let params = new HttpParams()
      .set('page', page.toString());

    return this.httpClient.get<MoviesHttpResponse>(
      `${MovieService.baseUrl}/movie/popular`,
      { params }
    );
  }

  public fetchMovie(id: string): Observable<DetailedMovie> {
    return this.httpClient.get<DetailedMovie>(
      `${MovieService.baseUrl}/movie/${id}`
    );
  }
}
