import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { Student } from '../../student.model';
import { StudentService } from '../../../service/student.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModalConfirmComponent } from "../../../shared/modal-confirm/modal-confirm.component";

@Component({
  selector: 'app-student',
  imports: [RouterLink, ModalConfirmComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit {
  student = signal<Student | undefined>(undefined)
  isModalVisible = signal(false)
  error = signal('');
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef)
  private activateRoute = inject(ActivatedRoute);
  private router = inject(Router);
  @Input() id!: string;

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params) => {
      const studentId = params.get('id');
      if (studentId) {
        this.fetchStudent(studentId);
      } else {
        this.error.set('ID del estudiante no proporcionado.');
      }
    });
  }

  private fetchStudent(studentId : string): void{
    const subscription = this.studentService.loadStudentById(studentId)
    .subscribe({
      next : (students) =>{
        //console.log('Estudiantes cargados',students);
        this.student.set(students);
      },
      error : (error :Error) =>{
        //console.log(error);
        this.error.set(error.message);
      },
      complete :()=>{
        //this.isFetching.set(false);
      }
    });
    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    })
  }

  onDelete(){
    this.isModalVisible.set(true);
  }

  confirmDelete() {
    const id = this.id;
    if (id) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.router.navigate(['../']); 
        },
        error: (err) => {
          //console.error('Error al eliminar estudiante:', err);
        },
      });
    }
    this.isModalVisible.set(false);
  }

  cancelDelete() {
    this.isModalVisible.set(false);
  }


}
