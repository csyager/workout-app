import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import {
    Link,
    BrowserRouter as Router
} from "react-router-dom"

function NavbarExtended() {
    return (
      <Navbar bg="light" expand="lg">
          <Container fluid>
                <Navbar.Brand href="#home">Workout App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Router>
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
                        <Nav.Link as={Link} to="/exercises">Exercises</Nav.Link>
                        <Nav.Link as={Link} to="/workout">Workout</Nav.Link>
                    </Router>
                </Navbar.Collapse>
          </Container>
      </Navbar>
    );
}

export default NavbarExtended;