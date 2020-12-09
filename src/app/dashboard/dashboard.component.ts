import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userForm: FormGroup;
  users: Array<{name: string, number: string}> = [
    {name: 'Bilal', number: '771422978'},
    {name: 'Bilal', number: '771422978'},
    {name: 'Bilal', number: '771422978'},
    {name: 'Bilal', number: '771422978'},
    {name: 'Bilal', number: '771422978'},
    {name: 'Bilal', number: '771422978'},
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: [null],
      number: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  submit(myform: FormGroupDirective): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.userForm.reset();
      myform.resetForm();
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
      form.get(key).setErrors(null) ;
    });
  }
}
