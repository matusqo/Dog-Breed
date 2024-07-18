import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogBreedComponent } from '../dog-breed/dog-breed.component';
import { DogBreed } from '../dog-breed';
import { DogBreedsService } from '../services/dog-breeds.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DogBreedComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  loadingResults: boolean = true;
  loadingError: any;
  dogBreedList: DogBreed[] = [];
  dogBreedFliteredList: DogBreed[] = [];
  dogBreedsService: DogBreedsService = inject(DogBreedsService);

  constructor() {
    // this.dogBreedList.push({
    //   id: 99999,
    //   name: "Sample Dog",
    //   description: "The Alapaha Blue Blood Bulldog is a well-developed, exaggerated bulldog with a broad head and natural drop ears. The prominent muzzle is covered by loose upper lips. The prominent eyes are set well apart. The Alapaha's coat is relatively short and fairly stiff. Preferred colors are blue merle, brown merle, or red merle all trimmed in white or chocolate and white. Also preferred are the glass eyes (blue) or marble eyes (brown and blue mixed in a single eye). The ears and tail are never trimmed or docked. The body is sturdy and very muscular. The well-muscled hips are narrower than the chest. The straight back is as long as the dog is high at the shoulders. The dewclaws are never removed and the feet are cat-like.",
    //   // description: "The Abyssinian is easy to care for, and a joy to have in your home. They’re affectionate cats and love both people and other animals.",
    //   life_span: "14 - 15",
    //   origin: "Middle East",
    //   reference_image_id: "BJa4kxc4X"
    // });
    // this.dogBreedFliteredList = this.dogBreedList;
    this.dogBreedsService.getAllDogBreeds(environment.dogBreedsLimit)
    .then((dogBreeds) => {
      this.dogBreedList = dogBreeds;
      this.dogBreedFliteredList = this.dogBreedList;
    }).catch((reason) => {
      this.loadingError = reason;
    }).finally(() => this.loadingResults = false);
  }

  private filterResults(searchString: string) {
    if(!searchString) {
      this.dogBreedFliteredList = this.dogBreedList;
      return;
    }

    this.dogBreedFliteredList = this.dogBreedList.filter((dogBreed) => dogBreed.name.toLowerCase().includes(searchString.toLowerCase()));
  }

  onSearchStringChanged(event: any) {
    this.filterResults(event.target.value);
  }
}