import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../shared/model/user.model';
import { AuthenticationService } from '../shared/service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | undefined
  isMenuOpen = false
  changeNavbarColor = false
  subscriptions: Subscription[] = []

  constructor(private authService: AuthenticationService, private router:Router) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  ngOnInit(): void {
    window.addEventListener("scroll", this.handleScroll);
    this.currentUser = this.authService.getUserFromLocalStorage()

    this.subscriptions.push(
      this.authService.loginEvent.subscribe((event: { isLogged: boolean }) => {
        if (event.isLogged)
          this.currentUser = this.authService.getUserFromLocalStorage()
        else if (!event.isLogged)
          this.currentUser = undefined
      })
    )
  }


  public handleScroll = () => {
    const scrollY = window.scrollY
    if (scrollY >= 30) {
      document.getElementById("header")?.classList.add("fixed-top")
    } else if (scrollY == 0) {
      document.getElementById("header")?.classList.remove("fixed-top")
    }
  }

  public clickedBtnMenu = () => {
    this.isMenuOpen = !this.isMenuOpen
    this.changeNavbarColor = this.isMenuOpen && scrollY == 0 ? true : false
  }

  public logOut = (): void => {
    this.authService.logOut()
    this.router.navigateByUrl("/login")
  }

}
