import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HeaderComponent } from "./header/header.component";

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [FooterComponent, NavbarComponent, SidebarComponent, HeaderComponent],
  exports: [FooterComponent, HeaderComponent, NavbarComponent, SidebarComponent]
})
export class ComponentsModule {}
