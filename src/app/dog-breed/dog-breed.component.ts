import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogBreed } from '../dog-breed';
import { DogBreedsService } from '../services/dog-breeds.service';
import { DogBreedImageAndDetails } from '../dog-breed-image-and-details';

@Component({
  selector: 'app-dog-breed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dog-breed.component.html',
  styleUrl: './dog-breed.component.scss'
})
export class DogBreedComponent {
  @Input()
  dogBreed!: DogBreed;

  moreInfoShown: boolean = false;
  dogBreedDetails: DogBreedImageAndDetails | null = null;
  
  dogBreedsService: DogBreedsService = inject(DogBreedsService);

  async onShowMorePressed() {
    console.log('show more clicked for ' + this.dogBreed.name);

    this.moreInfoShown = !this.moreInfoShown;
    if(!this.moreInfoShown) {
      return;
    }

    if(this.dogBreedDetails != null) {
      return;
    }
    
    console.log(this.dogBreed);
    
    this.dogBreedDetails = await this.dogBreedsService.getDogBreedImageAndDetails(this.dogBreed.reference_image_id);
    
    console.log(this.dogBreedDetails);
  }
}
