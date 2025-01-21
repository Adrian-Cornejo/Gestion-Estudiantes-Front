import { inject, Injectable, signal } from '@angular/core';
import { Student, StudentData } from '../component/student.model';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { catchError, map, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);
  private students = signal<Student[]>([]);

    getStudents(){
      return this.students();
    }

    loadStudents() {
      this.httpClient
        .get<{ student: Student[] }>('http://localhost:9000/estudiantes')
        .pipe(
          map((resData) => resData.student),
          catchError((error) => {
            this.errorService.showError('Error al cargar los estudiantes. Intentelo más tarde ');
            //console.error('Error al cargar estudiantes:', error);
            return throwError(() => new Error('Failed to load students'));
          })
        )
        .subscribe({
          next: (students) => {
            // console.log('Estudiantes cargados en el servicio:', students); // Si imprime 
            this.students.set(students);
          },
          error: (err) => console.error(err),
        });
    }

  loadStudentById(id: string){
    return this.fetchStudentById(
      `http://localhost:9000/estudiantes/${id}`,
      `Ha ocurrido un error al cargar el estudiante con el id ${id}`
    )
  }

addStudent(student : StudentData){
  return this.httpClient.post<Student>('http://localhost:9000/estudiantes',student)
  .pipe(
    map((newStudent)=>{
      this.students.update((current)=>[...current , newStudent]);
      //console.log('Lista actualizada: ', this.students);
      return newStudent;
    }),
    catchError((errror) => {
      this.errorService.showError('Error al agregar estudiante. Intentelo mas tarde')
      //console.error('Error al añadir estudiantes :', errror);
      return throwError (()=> new Error('Failed to add student'));
    })
  );
}

  editStudent(student :StudentData, id :string){
    return this.httpClient.put<Student>(`http://localhost:9000/estudiantes/${id}`,student)
    .pipe(
      map((updatedStudent)=>{
        this.students.update((current)=>
          current.map((s)=> (s.id === updatedStudent.id ? updatedStudent : s))
        );
        return updatedStudent;
      }),
      catchError(error =>{
        this.errorService.showError('Error al editar el estudiante. Intentelo más tarde ')
        return throwError(()=> new Error('Failed'));
      })
    )

  }

    deleteStudent(id: string) {
      return this.httpClient.delete(`http://localhost:9000/estudiantes/${id}`).pipe(
        map(() => {
          this.students.set(
            this.students().filter((student) => String(student.id) !== String(id))
          );
        }),
        catchError((error) => {
          return throwError(() => new Error('Failed to delete student'));
        })
      );
    }
    
    

  private fetchStudentById(url: string, errorMessage: string) {
    return this.httpClient
      .get<Student>(url)
      .pipe(
        map((resData) => resData),
        catchError((error) => {
          return throwError(() => new Error(errorMessage));
        })
      );
  }

}
