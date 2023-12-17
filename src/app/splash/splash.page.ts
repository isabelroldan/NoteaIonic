import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Tab2Page } from '../tab2/tab2.page';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SplashPage{

  constructor(public router: Router, public navCtrl: NavController) {
    setTimeout(() => {
      this.navCtrl.navigateForward('tabs');
    }, 2000);
  }

/**, { replaceUrl: true } */
  

}
