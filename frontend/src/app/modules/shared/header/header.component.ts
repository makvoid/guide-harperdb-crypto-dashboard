import { Component } from '@angular/core'

interface NavLink {
  title: string;
  link: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  navLinks: NavLink[] = [
    { title: 'Home', link: '/' },
    { title: 'Settings', link: '/settings' }
  ]

  isActive (link: string) {
    // If this is the dashboard (home) route, check the deployed URL as well
    // as HDB hosts our Frontend at /crypto/static
    if (link === '/') return [link, '/crypto/static/'].includes(window.location.pathname)
    return window.location.pathname.includes(link)
  }
}
