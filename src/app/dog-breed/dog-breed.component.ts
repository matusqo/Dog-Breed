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
    this.moreInfoShown = !this.moreInfoShown;
    if(!this.moreInfoShown) {
      return;
    }

    if(this.dogBreedDetails != null) {
      return;
    }
    
    this.dogBreedsService.getDogBreedImageAndDetailsStream(this.dogBreed.reference_image_id).subscribe(dogBreedDetails => this.dogBreedDetails = dogBreedDetails);
  }
}
