import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})

/**
 * The UserProfileComponent provides the user profile view.
 * 
 * Displays user info, the ability to modify user info, or
 * delete the user's account. This is also where a user
 * can view/edit their favorite movies.
 */
export class UserProfileComponent implements OnInit {
  user: any = {};
  initialInput: any = {};
  @Input() updatedUser = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  /**
   * Fetch the user's info with fetchApiData.getUser()
   * @returns an object of the user's info
   */
  getUserInfo(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.user = resp;
      console.log(this.user);
      this.updatedUser.Username = this.user.Username;
      this.updatedUser.Email = this.user.Email;
      this.updatedUser.Birthday = formatDate(this.user.Birthday, 'yyyy-MM-dd', 'en-US', 'UTC+0');
      console.log(this.updatedUser);
      return this.user;
    });
  }

  /**
   * Update the user's info with fetchApiData.editUser()
   */
  updateUserInfo(): void {
    this.fetchApiData.editUser(this.updatedUser).subscribe((result) => {
      console.log(result);
      this.snackBar.open('User profile successfully updated', 'OK', {
        duration: 2000,
      });
      if (this.user.Username !== result.Username || this.user.Password !== result.Password) {
        localStorage.clear();
        this.router.navigate(['welcome']);
        this.snackBar.open(
          'User profile successfully updated. Please login using your new credentials',
          'OK',
          {
            duration: 2000,
          }
        );
      }
    });
  }

  /**
   * Delete the user's info with fetchApiData.deleteUser()
   */
  deleteAccount(): void {
    if (confirm('All your data will be lost - this cannnot be undone!')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account - we are sorry to see you go!',
          'OK',
          {
            duration: 2000,
          }
        );
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
}