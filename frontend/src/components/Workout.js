import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import ClipLoader from 'react-spinners/ClipLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function AddSetModal() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);
    const [exercises, setExercises] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // form state
    const [exerciseDropdownValue, setExerciseDropdownValue] = useState("");
    const [metricAmount, setMetricAmount] = useState("");
    const [setNumber, setSetNumber] = useState("");
    const [reps, setReps] = useState("");

    const [metric, setMetric] = useState("");

    useEffect(() => {
        async function fetchExercises() {
            setLoading(true);
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await fetch('https://npkz4z37m3.execute-api.us-east-1.amazonaws.com/Prod/exercises', requestOptions);
            const responseStatus = await response.status;
            setStatus(responseStatus);
            const body = await response.json();
            setExercises(body["Exercises"]);
            setLoading(false);
            
        }
        fetchExercises();
    }, []);

    const handleSubmit = () => {
        async function postSet() {
            setLoading(true);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "exercise_name": exerciseDropdownValue,
                    "set_number": setNumber,
                    "metric": metric,
                    "metric_amount": metricAmount,
                    "reps": reps
                })
            };
            const response = await fetch('https://npkz4z37m3.execute-api.us-east-1.amazonaws.com/Prod/set', requestOptions);
            const responseStatus = await response.status;
            if (responseStatus === 200) {
                window.location.reload(false);
            }
        }
        postSet();
    }

    var formOptions = []
    for (var i = 0; i < exercises.length; i++) {
        formOptions.push (
            <option value={exercises[i]["name"]} data-metric={exercises[i]["metric"]} key={exercises[i]["name"]}>{exercises[i]["name"]}</option>
        )
    }

    const CustomAccordionToggle = ({ children, eventKey }) => {
        const decoratedOnClick = useAccordionButton(eventKey, (event) => {
            setExerciseDropdownValue(event.target.value);
            setMetric(event.target.options[event.target.selectedIndex].getAttribute("data-metric"));
        });
        return (
            <Form.Group className="mb-3">
                <Form.Select value={exerciseDropdownValue} onChange={decoratedOnClick} required >
                    <option value="" disabled>Select an exercise</option>
                    {formOptions}
                </Form.Select>
            </Form.Group>
        )
    }

    var modalBody;
    if (loading) {
        modalBody = <ClipLoader />
    } else {
        modalBody = (
            <Form>
                <Accordion flush>
                    <CustomAccordionToggle eventKey="0" />
                    <Accordion.Collapse eventKey="0">
                        <div>
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder={metric} value={metricAmount} onChange={(e) => setMetricAmount(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="number" placeholder="Set number" value={setNumber} onChange={(e) => setSetNumber(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control type="number" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} required />
                            </Form.Group>
                        </div>
                    </Accordion.Collapse>
                </Accordion>
            </Form>
        )
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add exercise <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add exercise</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalBody}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </> 
    )
}

function Workout() {
    const [status, setStatus] = useState(0);
    const [exercises, setExercises] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchSets() {
            setLoading(true);
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await fetch('https://npkz4z37m3.execute-api.us-east-1.amazonaws.com/Prod/set', requestOptions);
            const responseStatus = await response.status;
            setStatus(responseStatus);
            const body = await response.json();
            setExercises(body);
            setLoading(false);
        }
        fetchSets();
    }, []);
    
    if (loading) {
        return (
            <Container>
                <ClipLoader />
            </Container>
        )
    } else {
        if (status === 200) {
            console.log(exercises);
            var items = [];
            var keys = Object.keys(exercises);
            for (var i = 0; i < keys.length; i++) {
                var exercise_name = keys[i];
                var accordion_body = []
                for (var j = 0; j < exercises[exercise_name].length; j++) {
                    var set_number = exercises[exercise_name][j]["SetNumber"];
                    var metric_amount = exercises[exercise_name][j]["MetricAmount"];
                    var metric = exercises[exercise_name][j]["Metric"];
                    var reps = exercises[exercise_name][j]["Reps"];
                    accordion_body.push(
                        <ListGroup.Item key={set_number}>{set_number}. {metric_amount} {metric}, {reps} reps</ListGroup.Item>
                    )
                }
                items.push(
                    <Accordion.Item eventKey={exercise_name} key={exercise_name}>
                        <Accordion.Header>{exercise_name}</Accordion.Header>
                        <Accordion.Body>
                            <ListGroup variant="flush" className="set-list-group">
                                {accordion_body}
                            </ListGroup>
                        </Accordion.Body>
                    </Accordion.Item>
                )
            }
            return (
                <Container>
                    <Accordion>
                        {items}
                    </Accordion><br />
                    <div className="float-end">
                        <AddSetModal />
                    </div>
                </Container>
            )
        } else {
            return (
                <Alert variant="danger">
                    Fetch failed with status code {status}.
                </Alert>
            )
        }
    }
}

export default Workout;