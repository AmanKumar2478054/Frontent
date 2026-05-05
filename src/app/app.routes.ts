import { Routes } from '@angular/router';
import { Signup } from './Features/auth/signup/signup';
import { Login } from './Features/auth/login/login';
import { CitizenPortal } from './Features/citizen-portal/citizen-portal';
import { Admin } from './Features/admin/admin';
import { CityPlanner } from './Features/city-planner/city-planner';
import { ComplianceOfficer } from './Features/compliance-officer/compliance-officer';
import { GovernemntAuditor } from './Features/governemnt-auditor/governemnt-auditor';
import { Home } from './Features/home/home';
import { PagenotFound } from './pagenot-found/pagenot-found';
import { authGuard } from './core/guard/auth.guard';
import { roleGuard } from './core/guard/role.guard';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'auth/signup', component: Signup },
  { path: 'auth/login', component: Login },
  {
    path: 'citizen-portal',
    component: CitizenPortal,
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
  },
  {
    path: 'city-planner',
    component: CityPlanner,
    canActivate: [authGuard, roleGuard],
    data: { role: 'PLANNER' },
  },
  {
    path: 'compliance-officer',
    component: ComplianceOfficer,
    canActivate: [authGuard, roleGuard],
    data: { role: 'COMPLIANCE' },
  },
  {
    path: 'government-auditor',
    component: GovernemntAuditor,
    canActivate: [authGuard, roleGuard],
    data: { role: 'AUDITOR' },
  },
  { path: 'not-found', component: PagenotFound },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found' },
];