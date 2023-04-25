import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})

/**
 * The UserLoginFormComponent is a modal with inputs for
 * username and password. Successful login navigates to the
 * movies view.
 */
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
  *  Calls userLogin() (found in FetchApiDataService)
  *  with the user input field data (object) as an argument.
  */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        let user = result.user.Username;
        let token = result.token;
        localStorage.setItem('user', user);
        localStorage.setItem('token', token);
        console.log(user, token);
        this.dialogRef.close();
        this.snackBar.open('User login successful', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (result) => {
        this.snackBar.open('User login failed', 'OK', {
          duration: 2000,
        });
      }
      );
    }
}
