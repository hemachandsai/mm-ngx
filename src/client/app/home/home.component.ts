import { Component, ViewChild, Input, Output, OnInit, EventEmitter, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { OrderWindowComponent } from '../order-window/order-window.component';
import { DoctorsListComponent } from '../doctors-list/doctors-list.component';
import { OrderRequest } from '../shared/database/order-request';
import { SpecialityService } from '../shared/speciality/speciality.service';
import { Specialities } from '../shared/database/speciality';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ChatService } from '../chat/chat.service';
import { UserDetails } from '../shared/database/user-details';
import { LOCATIONS } from '../shared/database/mock-location';
import { ContentsComponent } from '../contents/contents.component';
import { SecurityService } from '../shared/services/security.service';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

  pageTitle: string = 'Mesomeds';
  speciality: string;
  mobileNumber: number;
  specialities: Specialities[];
  navIsFixed: boolean = false;
  user: UserDetails;
  locations = LOCATIONS;
  current: string = 'Bengaluru';
  cookie: any = null;

  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
  @ViewChild(ContentsComponent) contentsComponent: ContentsComponent;
  @ViewChild(OrderWindowComponent)
  modalHtml: OrderWindowComponent;
  @ViewChild(DoctorsListComponent)
  modalHtml1: DoctorsListComponent;

  constructor(@Inject(DOCUMENT) private document: Document, // used to get the position of the scroll
    private specialityService: SpecialityService,
    private chatService: ChatService,
    private router: Router,
    private securityService: SecurityService
  ) { //constructor for LocationService
  }

  //function to validate the phone number entered and open the OrderWindow else show an alert
  open(value: any) {
    let result: boolean = isNaN(value.mobileNumber);
    if (result === true || value.mobileNumber.toString().length < 10 || value.mobileNumber.toString().match(/^\s*$/g)
      || value.speciality === null || value.speciality === 'Select') {
      return;
    } else {
      this.modalHtml.open();
    }
  }

  openConsultant(value: any) {
    //let result: boolean = isNaN(value.mobileNumber);
    //let speciality: string = value.speciality;
    //let mobileNumber: number = value.mobileNumber;
    //this.user = this.chatService.getUser();
    this.cookie = this.securityService.getCookie();
    /*if (result === true || value.mobileNumber.toString().length < 10 || value.mobileNumber.toString().match(/^\s*$/g)
      || speciality === null || speciality === 'Select') {
      return;
    } else {*/
      if ((this.cookie)) {
        this.router.navigate([`/chat/${JSON.parse(this.cookie).id}`]);
      } else {
        this.router.navigate([`/login`]);
      }
    //}
  }

  //initializes the select field options from LocationService
  ngOnInit(): void {
    //this.getSpecialities();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let number = window.scrollY;
    if (number > 500) {
      this.navIsFixed = true;
      document.getElementById('myBtn').style.display = 'block';
      this.navbarComponent.navbarColor(number, '#534FFE');
    } else if (this.navIsFixed && number < 1000) {
      this.navIsFixed = false;
      document.getElementById('myBtn').style.display = 'none';
      this.navbarComponent.navbarColor(number, 'transparent');
    }

    //for moving to next section
    if(number > 100) {
      this.contentsComponent.scrollDownHidden(number);
    } else {
      this.contentsComponent.scrollDownHidden(number);
    }
  }

  getSpecialities() {
    this.specialityService.getSpecialities()
      .then(specialities => this.specialities = specialities);
  }
}
