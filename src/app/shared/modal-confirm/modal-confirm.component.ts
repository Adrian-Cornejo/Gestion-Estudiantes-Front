import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  imports: [],
  templateUrl: './modal-confirm.component.html',
  styleUrl: './modal-confirm.component.css'
})
export class ModalConfirmComponent {
  title = input('Confirmacion');
  message = input('¿Estás seguro de realizar esta acción?')
  isVisible = input(false);
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(){
    this.confirm.emit();
  }
  onCancel(){
    this.cancel.emit();
  }
}
