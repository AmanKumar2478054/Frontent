import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Service/auth.service';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
})
export class Signup implements OnInit {
  signupForm: FormGroup;
  selectedRole: string = 'Citizen';
  roles = ['Citizen', 'City Planner', 'Administrator', 'Compliance Officer', 'Government Auditor'];

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute , private AuthService:AuthService) {
    this.signupForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  role: ['Citizen', Validators.required],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const role = params['role'];
      if (role && this.roles.includes(role)) {
        this.selectedRole = role;
        this.signupForm.patchValue({ Role: role });
        this.loadDataForRole(role);
      }
    });
  }

  onRoleChange(newRole: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { role: newRole },
      queryParamsHandling: 'merge'
    });
    this.signupForm.patchValue({ Role: newRole });
  }

  loadDataForRole(role: string) {
    console.log('Fetching data for:', role);
    this.selectedRole = role;
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