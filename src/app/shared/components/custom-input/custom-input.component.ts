import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.css',
})
export class CustomInputComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() inputType = '';
  @Input() required = false;
  @Input() inputControl!: FormControl;
  @Input() errorMessage: Record<string, string> = {};

  ngOnInit() {
    if (!this.inputControl) {
      this.inputControl = new FormControl();
    }
  }

  get hasError() {
    return this.inputControl
      ? this.inputControl.invalid && this.inputControl.dirty
      : false;
  }

  get errorType() {
    if (!this.inputControl || !this.inputControl.errors) return;
    return Object.keys(this.inputControl.errors)[0];
  }
}
