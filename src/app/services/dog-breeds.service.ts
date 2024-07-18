import { Injectable } from '@angular/core';
import { DogBreed } from '../dog-breed';
import { DogBreedImageAndDetails } from '../dog-breed-image-and-details';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DogBreedsService {
  private readonly apiKey = environment.dogApiToken;
  private readonly breedsUrl = environment.dogBreedsApiUrl;
  private readonly imagesUrl = environment.dogBreedsImagesApiUrl;

  // dogBreedList: DogBreed[] = [
  //   {
  //     name: "Corgi",
  //     description: "Small happy dog",
  //     lifeSpan: "10-15",
  //     origin: "GB"
  //   },
  //   {
  //     name: "Rotweiler",
  //     description: "Small happy dog",
  //     lifeSpan: "10-15",
  //     origin: "GB"
  //   },
  //   {
  //     name: "Dobermann",
  //     description: "Small happy dog",
  //     lifeSpan: "10-15",
  //     origin: "GB"
  //   },
  //   {
  //     name: "Border Collie",
  //     description: "Small happy dog",
  //     lifeSpan: "10-15",
  //     origin: "GB"
  //   }
  // ];

  async getAllDogBreeds(limit: number | null = null): Promise<DogBreed[]> {
    const url = limit ? this.breedsUrl + `?limit=${limit}` : this.breedsUrl;
    const response = await this.callApi(url);
    return this.parseResponse(response) ?? [];
    ;
  }

  async getDogBreedImageAndDetails(id: string): Promise<DogBreedImageAndDetails | null> {
    const response = await this.callApi(this.imagesUrl + `/${id}`);
    return this.parseResponse(response) ?? null;
  }

  private async callApi(url: string): Promise<Response | null> {
    try {
      const response = await fetch(url, {
        headers: {
          "X-Api-Key": this.apiKey
        }
      });

      if (!response.ok) {
        console.error(`Error calling Dog API at ${url} - HTTP ${response.status}`)
        throw new Error();
      }

      return response;
    } catch (error) {
      throw new Error("Error when calling Dog API", {cause: error});
    }
  }

  private async parseResponse(response: Response | null): Promise<any> {
    return (await response?.json() ?? null);
  }
}
