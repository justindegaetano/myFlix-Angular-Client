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

/**
 * The UserFavoriteMoviesComponent class fetches and displays the
 * user's favorite movies in card format in the user profile view
 */
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

  /**
   * Called OnInit, and whenever the favorite (heart) icon is clicked.
   * 
   * Empties this.favorites[] and this.favoriteMovies[], an array of movie ids
   * and an array of movie objects respectively.
   * 
   * Then, fetch the user's favorite movies and set this.favorites as the response.
   * 
   * Then, (using the map method) for each favorite (string) in this.favorites[],
   * fetch the movie (Object) by the id and push the response into this.favoriteMovies[]
   */
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

  /**
   * Check if a movie id is included in the user's favorites
   * @param id
   * @returns a boolean value
   */
  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  /**
   * Add one movie id into the user's favorites with FetchApiDataService.addFavoriteMovie()
   * @param id
   */
  addToFavorites(id: string): void {
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  /**
   * Remove one movie id from the user's favorites with FetchApiDataService.removeFavoriteMovie()
   * @param id
   */
  removeFromFavorites(id: string): void {
    this.fetchApiData.removeFavoriteMovie(id).subscribe((result) => {
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  /**
   * Open the Movie Details dialog modal displaying the movie title and description
   * @param title
   * @param description
   */
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