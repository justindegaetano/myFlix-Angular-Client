import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-favorite-movies',
  templateUrl: './user-favorite-movies.component.html',
  styleUrls: ['./user-favorite-movies.component.scss'],
})

export class UserFavoriteMoviesComponent implements OnInit{
  favorites: any[] = [];
  favoriteMovies: any[] = []; 
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getFavoriteMovies();
  }

  // Get current list of user favorites
  getFavoriteMovies(): void {
    this.favorites, this.favoriteMovies = [];
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.favorites = resp.FavoriteMovies;
      this.favorites.map((favorite: any) => {
        this.fetchApiData.getMovie(favorite).subscribe((resp: any) => {
          this.favoriteMovies.push(resp);
        });
      });
    });
  }

  // Checks if selected movie ID is already in user favorites
  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  // Add movie ID into the user favorites
  addToFavorites(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  // Remove movie ID from the user favorites
  removeFromFavorites(id: string): void {
    this.fetchApiData.removeFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  // Open the Movie Details modal displaying the movie title and description
  openSummary(title: string, description: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Title: title,
        Description: description,
      },
      width: '25rem',
    });
  }
}