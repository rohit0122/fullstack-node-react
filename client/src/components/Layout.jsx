import { NavLink, Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function Layout() {
  const menuItems = [
    {
      href: "/",
      title: "Home",
    },
    {
      href: "home2",
      title: "Home 2",
    },
    {
      href: "home3",
      title: "Home 3",
    },
    {
      href: "edit",
      title: "Edit",
    },
    {
      href: "contact",
      title: "Contact",
    },

    
  ];

  return (
    <Container fluid>
      <Navbar className="bg-body-tertiary">
        <Navbar.Brand href="/">F tree</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {menuItems.map(({ href, title }) => (
              <li className="m-2" key={title}>
                <NavLink to={href}>
                  {title}
                </NavLink>
              </li>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <main className={"flex-1"}>
        <Outlet />
      </main>
    </Container>
  );
}
