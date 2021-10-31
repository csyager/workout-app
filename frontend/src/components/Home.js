import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
    Link
} from "react-router-dom"

function Home() {
    return (
        <Container>
            <Row>
                <Button variant="primary" as={Col, Link} to="/calendar" className="home-button">Calendar</Button>
            </Row>
            <Row>
                <Button variant="secondary" as={Col} className="home-button">Exercises</Button>
            </Row>
            <Row>
                <Button variant="success" as={Col} className="home-button">Workout</Button>
            </Row>
        </Container>
    )
}

export default Home;