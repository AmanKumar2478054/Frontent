import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavbar } from '../../core/components/top-navbar/top-navbar';

@Component({
  selector: 'app-governemnt-auditor',
  imports: [CommonModule, TopNavbar],
  templateUrl: './governemnt-auditor.html',
  styleUrl: './governemnt-auditor.css',
})
export class GovernemntAuditor {}
