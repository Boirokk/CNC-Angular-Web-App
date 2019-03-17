import { AngularFirestore } from '@angular/fire/firestore';
import {Component, OnInit} from '@angular/core';
import { EmployeeService } from 'src/app/shared/employee.service';
import { Employee } from 'src/app/shared/employee.model';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  started = false;
  isSelected: number;
  value: number;
  list: Employee[];
  interval: any;
  constructor(private service: EmployeeService,
              private firestore: AngularFirestore,
              private toast: ToastrService) { }

  ngOnInit() {
    this.service.getEmployees().subscribe(actionArray => {
      this.list = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Employee;
      });
    });
  }


  transform(value: number): string {
    return new Date(value * 1000).toISOString().substr(11, 8 );
  }


  startTimer(emp: Employee) {
    this.interval = setInterval(() => {
      emp.time++;
      this.value = emp.time;
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  onToggleTimer(emp: Employee) {
    if (emp.time == null) {
      emp.time = 0;
    }
    if (!this.started) {
      this.startTimer(emp);

    } else {
      this.pauseTimer();
      this.firestore.doc('employees/' + emp.id).update({time: emp.time});
    }
  }

  onToggleTimerClass(i: number) {
    this.started = !this.started;
    this.isSelected = i;
  }

  onEdit(emp: Employee) {
    this.service.formData = Object.assign({}, emp);
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.firestore.doc('employees/' + id).delete();
      this.toast.warning('Deleted Successfully!', 'No turning back now!');
    }
  }
}
