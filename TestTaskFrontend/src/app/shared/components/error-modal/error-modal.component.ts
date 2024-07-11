import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss'
})
export class ErrorModalComponent {
  @Input({required:true})
  errorText! : string;
  activeModal : NgbActiveModal;

  constructor(activeModal: NgbActiveModal)
  {
    this.activeModal = activeModal;
  }
}
