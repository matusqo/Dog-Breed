import { DogBreed } from "./dog-breed";

export interface DogBreedImageAndDetails extends DogBreed {
    url: string;
}