import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SustainabilityMetric {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
  description: string;
}

interface SustainabilityProject {
  title: string;
  description: string;
  image: string;
  status: 'Active' | 'Completed' | 'Planning';
  impact: string;
}

interface NewsItem {
  title: string;
  date: string;
  summary: string;
  image: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  sustainabilityMetrics: SustainabilityMetric[] = [
    {
      title: 'Carbon Footprint Reduction',
      value: '23.5%',
      change: '+5.2%',
      icon: '🌱',
      color: 'green',
      description: 'City-wide carbon emissions reduced this year'
    },
    {
      title: 'Green Spaces',
      value: '1,247',
      change: '+89',
      icon: '🌳',
      color: 'emerald',
      description: 'Acres of new parks and green areas added'
    },
    {
      title: 'Renewable Energy',
      value: '67.8%',
      change: '+12.3%',
      icon: '☀️',
      color: 'yellow',
      description: 'Energy from renewable sources'
    },
    {
      title: 'Waste Recycled',
      value: '84.2%',
      change: '+3.1%',
      icon: '♻️',
      color: 'blue',
      description: 'Municipal waste diverted from landfills'
    },
    {
      title: 'Public Transport Usage',
      value: '71.5%',
      change: '+8.7%',
      icon: '🚇',
      color: 'purple',
      description: 'Daily commuters using public transport'
    },
    {
      title: 'Water Conservation',
      value: '156M',
      change: '+24M',
      icon: '💧',
      color: 'cyan',
      description: 'Gallons of water saved annually'
    }
  ];

  featuredProjects: SustainabilityProject[] = [
    {
      title: 'Urban Green Corridor',
      description: 'Connecting city parks with pedestrian-friendly green pathways',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      status: 'Active',
      impact: '45 acres of new green space, improved air quality'
    },
    {
      title: 'Solar Panel Initiative',
      description: 'Installing solar panels on municipal buildings',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop',
      status: 'Active',
      impact: '30% reduction in municipal energy costs'
    },
    {
      title: 'Community Garden Network',
      description: 'Urban farming spaces for local food production',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop',
      status: 'Completed',
      impact: '12 new community gardens, 500+ participants'
    }
  ];

  recentNews: NewsItem[] = [
    {
      title: 'GreenCity Wins National Sustainability Award',
      date: 'April 15, 2026',
      summary: 'Our city has been recognized for outstanding environmental achievements in urban sustainability.',
      image: 'https://images.unsplash.com/photo-1541873676-a18131494184?w=300&h=200&fit=crop'
    },
    {
      title: 'New Electric Bus Fleet Launched',
      date: 'April 10, 2026',
      summary: '50 new zero-emission buses now serving our public transportation network.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop'
    },
    {
      title: 'Water Conservation Campaign Success',
      date: 'April 5, 2026',
      summary: 'Community efforts have reduced water usage by 18% in the past quarter.',
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop'
    }
  ];

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Planning': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  getMetricColor(color: string): string {
    const colors: { [key: string]: string } = {
      'green': 'border-green-200 bg-green-50',
      'emerald': 'border-emerald-200 bg-emerald-50',
      'yellow': 'border-yellow-200 bg-yellow-50',
      'blue': 'border-blue-200 bg-blue-50',
      'purple': 'border-purple-200 bg-purple-50',
      'cyan': 'border-cyan-200 bg-cyan-50'
    };
    return colors[color] || 'border-gray-200 bg-gray-50';
  }
}
