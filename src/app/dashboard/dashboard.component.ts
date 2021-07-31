import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ElectronService} from 'ngx-electron';
import {UserService} from '../services/user.service';
import {User} from '../dtos/user';
import {start} from 'repl';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userForm: FormGroup;
  users: Array<User> = [];
  isUpdate = false;
  selectedId = 0;
  search: any;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private electron: ElectronService, private userService: UserService) {
    this.userForm = this.fb.group({
      name: [null],
      number: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    if (this.electron.isElectronApp) {
      this.userService.getUsers()
        .subscribe(value => {
          this.users = value;
        }, error => console.log(error));
    }
  }

  deleteUser(myform: FormGroupDirective) {
    this.userService.deleteUser(this.selectedId)
      .subscribe(value => {
        if (value) {
          const index = this.users.findIndex(value1 => value1.userId === this.selectedId);
          this.users.splice(index, 1);
        }
        this.isUpdate = false;
        this.userForm.reset();
        myform.resetForm();
      });
  }

  updateUser(myform: FormGroupDirective) {
    if (this.electron.isElectronApp && this.userForm.valid) {
      console.log(this.userForm.value);
      const temp = {...this.userForm.value};
      temp.userId = this.selectedId;
      this.userService.updateUser(temp)
        .subscribe(value => {
          if (value) {
            const index = this.users.findIndex(value1 => value1.userId = this.selectedId);
            this.users[index] = value;
          }
          this.isUpdate = false;
          this.userForm.reset();
          myform.resetForm();
        });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  submit(myform: FormGroupDirective): void {
    if (this.userForm.valid && this.electron.isElectronApp) {
      console.log(this.userForm.value);
      this.userService.addUser(this.userForm.value)
        .subscribe(res => {
          if (res) {
            this.users.unshift(res);
          }
          this.userForm.reset();
          myform.resetForm();
        }, error => console.log(error));

    } else {
      this.userForm.markAllAsTouched();
    }
  }

  resetForm(form: FormGroup): void {
    form.reset();
    form.markAsUntouched();
    form.markAsPristine();
    Object.keys(form.controls).forEach(key => {
      // @ts-ignore
      form.get(key).setErrors(null);
    });
  }

  onTablePressed(obj: User): void {
    this.userForm.patchValue(obj);
    this.isUpdate = true;
    this.selectedId = obj.userId;
    console.log(obj.userId);
  }

  openDialogGenrate(): void {
    const dialogRef = this.dialog.open(GenerateDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  cancelUpdate(myform: FormGroupDirective) {
    this.isUpdate = false;
    this.userForm.reset();
    myform.resetForm();
  }

  searchUsers() {
    if (this.search === '' || !this.search) {
      this.getAll();
    } else {
      this.userService.findUser(this.search)
        .subscribe(value => {
          console.log(value);
          this.users = value;
        });
    }
  }

  addDoc() {
    this.userService.addDoc()
      .subscribe(value => {
        if (value === 'successful') {
          this.getAll();
        }
      });
  }
}

@Component({
  selector: 'app-genrate-dialog',
  templateUrl: 'dialogs/generate.dialog.html',
})
export class GenerateDialog {
  count = 250;
  startWith = null;

  constructor(private userService: UserService, private dialog: MatDialogRef<GenerateDialog>) {
  }

  generate() {
    console.log('generating');
    this.userService.generateText(this.count, this.startWith)
      .subscribe(value => {
        console.log(value);
        this.dialog.close();
      });
  }
}
