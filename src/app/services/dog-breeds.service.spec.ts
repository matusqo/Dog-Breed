import { TestBed } from '@angular/core/testing';

import { DogBreedsService } from './dog-breeds.service';

describe('DogBreedsService', () => {
  let service: DogBreedsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DogBreedsService);
  });

  it('should be created', async () => {
    expect(service).toBeTruthy()
  });

  it('should return some breeds', async () => {
    const result = await service.getAllDogBreeds(1);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return breed image and details', async () => {
    const breeds = await service.getAllDogBreeds(1);
    const reference_image_id = breeds.at(0)?.reference_image_id;
    if(reference_image_id) {
      const result = await service.getDogBreedImageAndDetails(reference_image_id);
      expect(result?.url).toBeTruthy();
    }
  });
});
