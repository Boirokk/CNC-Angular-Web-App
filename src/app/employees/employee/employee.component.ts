import { Component, OnInit } from '@angular/core';
import {EmployeeService} from '../../shared/employee.service';
import {NgForm} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  myDate = new Date();


  constructor(public service: EmployeeService,
              private firestore: AngularFirestore,
              private toast: ToastrService) { }

  ngOnInit() {
    this.resetForm();
  }


  resetForm(form?: NgForm) {
    if (form != null) {
      form.resetForm();
    }

    this.service.formData = {
      id: null,
      initials: '',
      part: '',
      description: '',
      manufacturer: '',
      model: '',
      time: 0
    };
  }
  onSubmit(form: NgForm) {
    const data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id == null) {
      this.firestore.collection('employees').add(data);
      this.toast.success('Submitted Successfully!', 'New Entry');
    } else {
      this.firestore.doc('employees/' + form.value.id).update(data);
      this.toast.success('Submitted Successfully!', 'Update');
    }
    this.resetForm(form);
  }
}
