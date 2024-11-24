import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  @Input() type: 'spinner' | 'dots' | 'pulse' | 'ping' = 'spinner';

  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color?: string;

  get sizeClasses(): string {
    const sizes = {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
      xl: 'h-20 w-20',
    };
    return sizes[this.size];
  }
}
