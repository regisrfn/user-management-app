import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  showMenu = false

  handleScroll() {
    const scrollY = window.scrollY
    if (scrollY >= 50) {
      document.getElementById("header")?.classList.add("fixed-top")
    } else if (scrollY == 0) {
      document.getElementById("header")?.classList.remove("fixed-top")
    }
  }

  ngOnInit(): void {
    window.addEventListener("scroll", this.handleScroll);
  }

}
