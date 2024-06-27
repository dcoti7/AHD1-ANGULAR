import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

interface User {
  name: string;
  age: number;
  dpi: string;
}

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent implements OnInit{
  userForm: FormGroup;
  users: User[] = [];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      dpi: ['', [Validators.required, this.uniqueDpiValidator.bind(this)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      this.users.push(user);
      this.saveUsers();
      this.userForm.reset();
    }
  }

  removeUser(dpi: string): void {
    this.users = this.users.filter(user => user.dpi !== dpi);
    this.saveUsers();
  }

  private saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  private loadUsers(): void {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      this.users = JSON.parse(usersData);
    }
  }
  private uniqueDpiValidator(control: AbstractControl): ValidationErrors | null {
    const dpi = control.value;
    const userExists = this.users.some(user => user.dpi === dpi);
    return userExists ? { dpiNotUnique: true } : null;
  }

}


