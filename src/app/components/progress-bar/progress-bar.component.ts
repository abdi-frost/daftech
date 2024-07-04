import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  @Input() progress: number = 0; // Default progress value
  @Input() isError: boolean = false; // Optional flag for error state
  @Input() showPercentage: boolean = true; // Optional flag for percentage display

  constructor() {}

  ngOnInit() {}

  get progressStyle(): string {
    return `width: ${this.progress.toFixed(2)}%`;
  }

  get progressBarColor(): string {
    if (this.isError) {
      return 'bg-red-500';
    } else {
      return this.progress < 100 ? 'bg-blue-600' : 'bg-teal-500'; // Adjust colors as needed
    }
  }
}
