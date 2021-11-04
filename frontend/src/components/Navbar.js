import { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import {
    Link
} from "react-router-dom"

function NavbarExtended() {
    const [expanded, setExpanded] = useState(false);
    return (
      <Navbar bg="light" expand="lg" expanded={expanded}>
          <Container fluid>
                <Navbar.Brand href="#home">Workout App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
                    <Nav.Link as={Link} to="/calendar" onClick={() => setExpanded(false)}>Calendar</Nav.Link>
                    <Nav.Link as={Link} to="/exercises" onClick={() => setExpanded(false)}>Exercises</Nav.Link>
                    <Nav.Link as={Link} to="/workout" onClick={() => setExpanded(false)}>Workout</Nav.Link>
                </Navbar.Collapse>
          </Container>
      </Navbar>
    );
}

export default NavbarExtended;