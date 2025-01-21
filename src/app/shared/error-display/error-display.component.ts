import { Component, inject, OnInit, signal } from '@angular/core';
import { ErrorService } from '../../service/error.service';

@Component({
  selector: 'app-error-display',
  imports: [],
  templateUrl: './error-display.component.html',
  styleUrl: './error-display.component.css'
})
export class ErrorDisplayComponent implements OnInit{
  errorMessage = signal<string | null>(null);
  private errorService = inject(ErrorService);

  ngOnInit(): void {
    this.errorMessage= this.errorService.getError();
  }
  
  clearError(){
    this.errorService.clearError();
  }
}
