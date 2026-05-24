import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  standalone: false,
  templateUrl: './skeleton-loader.html',
  styleUrl: './skeleton-loader.scss',
})
export class SkeletonLoader {
  readonly skeletonItems = [1, 2, 3];
}
