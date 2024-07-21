import { Injectable } from '@angular/core';
import { DogBreed } from '../dog-breed';
import { DogBreedImageAndDetails } from '../dog-breed-image-and-details';
import { environment } from '../../environments/environment';
import { catchError, concatAll, from, map, Observable, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DogBreedsService {
  private readonly apiKey = environment.dogApiToken;
  private readonly breedsUrl = environment.dogBreedsApiUrl;
  private readonly imagesUrl = environment.dogBreedsImagesApiUrl;

  constructor(private readonly httpClient: HttpClient) { }

  getAllDogBreedsStream(limit: number | null = null): Observable<DogBreed> {
    const url = limit ? this.breedsUrl + `?limit=${limit}` : this.breedsUrl;
    return this.callApiStreamed(url).pipe(
      map(response => response.body),
      map((body: DogBreed[]) => from(body)),
      concatAll()
    );
  }

  getDogBreedImageAndDetailsStream(id: string): Observable<DogBreedImageAndDetails> {
    const url = this.imagesUrl + `/${id}`;
    return this.callApiStreamed(url).pipe(
      map(response => response.body as DogBreedImageAndDetails),
    );
  }

  private callApiStreamed(url: string): Observable<HttpResponse<any>> {
    return this.httpClient.get(url, {
      headers: {
        "X-Api-Key": this.apiKey
      },
      observe: "response"
    })
    .pipe(
      tap({
        next: response => {
          if(response.body == null) {
            const message = `Error calling Dog API at ${url} - body is null`;
            console.error(message)
            throw new Error(message);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        throw new Error("Error when calling The Dog API", { cause: error });
      })
    );
  }
}
