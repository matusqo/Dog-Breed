import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogBreedComponent } from '../dog-breed/dog-breed.component';
import { DogBreed } from '../dog-breed';
import { DogBreedsService } from '../services/dog-breeds.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DogBreedComponent, AsyncPipe, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly searchBox: FormControl = new FormControl();

  loading: boolean = false;
  loadingError: any;

  readonly dogBreedList: DogBreed[] = [];
  readonly dogBreedsStream$: Observable<DogBreed[]>;
  private readonly dogBreedsLoadedSignal: WritableSignal<DogBreed[]> = signal([]);
  
  private dogBreedsService: DogBreedsService = inject(DogBreedsService);

  constructor() {
    this.dogBreedsStream$ = toObservable(this.dogBreedsLoadedSignal);
    this.dogBreedsService.getAllDogBreedsStream(environment.dogBreedsLimit)
    .subscribe({
      next: dogBreed => {
        this.dogBreedList.push(dogBreed)
        this.dogBreedsLoadedSignal.set(this.dogBreedList);    // Progressive loading on UI in case the DogBreedsService would support data streaming. Can be tested by zipping the Observable with interval
      },
      complete: () => this.onLoadingCompleted(),
      error: (error) => this.onLoadingFailed(error)
    });

    this.searchBox.valueChanges.subscribe((searchString: string) => this.filterResults(searchString));
  }

  private onLoadingCompleted() {
    this.loading = false; 
    this.dogBreedsLoadedSignal.set(this.dogBreedList);
  }

  private onLoadingFailed(error: any) {
    this.loadingError = error;
    this.loading = false;
  }

  private filterResults(searchString: string) {
    this.dogBreedsLoadedSignal.set(this.dogBreedList.filter(dogBreed => !searchString || dogBreed.name.toLowerCase().includes(searchString.toLowerCase())));
  }
}