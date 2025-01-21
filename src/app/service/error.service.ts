import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessage = signal<string | null>(null);

  showError(message : string){
    this.errorMessage.set(message);
    console.log(message)
  }

  clearError(){
    this.errorMessage.set(null);
  }
  getError(){
    return this.errorMessage;
  }
  

}
