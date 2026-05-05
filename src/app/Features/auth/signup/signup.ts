import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Service/auth.service';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
})
export class Signup {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private AuthService:AuthService) {
    this.signupForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
  }

  // onSubmit() {
  //   if (this.signupForm.valid) {
  //     console.log('Registration Data:', this.signupForm.value);
  //     alert('Account created successfully!');
  //     this.router.navigate(['/auth/login']);
  //   }
  // }

   onSubmit(): void {
    console.log('Raw Form Value:', this.signupForm.value);
    if (this.signupForm.valid) {
      this.AuthService.registerUser(this.signupForm.value)
        .subscribe({
          next: (res) => {
            console.log('User registered successfully', res);
            alert('Account created successfully!');
            this.router.navigate(['/auth/login']);  
          },
          error: (err) => {
            console.error('Registration failed', err);
          }
        });
    }
  }
}