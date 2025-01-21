import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { StudentService } from '../../service/student.service';
import { Student } from '../student.model';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-students',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit{
  student = signal<Student[] | undefined>(undefined)
  private studentService = inject(StudentService);
  students = computed(()=> this.studentService.getStudents());
  searchStudent = signal('');
  
  currentPage=signal(1);
  pageSize = 4;
  totalPages = computed(() => {
    const total = Math.ceil(this.filteredStudent().length / this.pageSize);
    return isNaN(total) ? 1 : total;
  });

  paginatedStudents = computed(()=>{
    const sortedStudent = [ ...this.filteredStudent()].sort((a,b)=>
      a.nombre.localeCompare(b.nombre)
    );
    const startIndex = (this.currentPage()-1)* this.pageSize;
    return sortedStudent.slice(startIndex,startIndex+this.pageSize);
  });

  filteredStudent = computed(()=>{
    const search = this.searchStudent().toLowerCase();
    return this.students().filter((student)=>
      student.nombre.toLowerCase().includes(search)
    );
  });


  ngOnInit(): void {
    this.studentService.loadStudents();
    this.searchStudent.set('')
  }

  nextPage(){
    if(this.currentPage()< this.totalPages()!){
      this.currentPage.set(this.currentPage()+1);
    }
  }
  previousPage(){
    if(this.currentPage()>1){
      this.currentPage.set(this.currentPage()-1)
    }
  }
  onSearchStudent(event : Event){
    const input =  event.target as HTMLInputElement;
    this.searchStudent.set(input.value);
    this.currentPage.set(1);

  }

}
