import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons'
import {
    Link
} from "react-router-dom"


function CreateExerciseModal() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState(false);
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // form fields
    const [exerciseName, setExerciseName] = useState("");
    const [categoryDropdownValue, setCategoryDropdownValue] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");

    const [submitStatus, setSubmitStatus] = useState(0);

    // form submission
    const handleSubmit = () => {
        async function submitForm() {
            var categoryName;
            if (newCategory) {
                categoryName = newCategoryName;
            } else {
                categoryName = categoryDropdownValue;
            }
            setLoading(true);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'name': exerciseName,
                    'category': categoryName
                })
            };
            const response = await fetch('https://npkz4z37m3.execute-api.us-east-1.amazonaws.com/Prod/exercises', requestOptions);
            const responseStatus = await response.status;
            setSubmitStatus(responseStatus);
            setLoading(false);
            if (responseStatus !== 0 && responseStatus !== 200) {
                document.getElementById("errorPlaceholder").innerHTML = "<Alert variant=\"danger\">Request to create exercise failed.  Status code {responseStatus}</Alert>"
            } else if (responseStatus === 200) {
                window.location.reload(false);
            }
            
        }
        submitForm();
    }

    useEffect(() => {
        async function fetchCategories() {
            setLoading(true);
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await fetch('https://npkz4z37m3.execute-api.us-east-1.amazonaws.com/Prod/categories', requestOptions);
            const responseStatus = await response.status;
            setStatus(responseStatus);
            const body = await response.json();
            setCategories(body["categories"]);
            setLoading(false);
            
        }
        fetchCategories();
    }, [])

    const CustomAccordionToggle = ({ children, eventKey }) => {
        const decoratedOnClick = useAccordionButton(eventKey, (event) => {
            setNewCategory(event.target.checked);
        });
        return (
            <>
                <Form.Check type="checkbox" label="Create new category" checked={newCategory} onChange={decoratedOnClick}/>
                {children}
            </>
        )
    }

    var formOptions = []
    for (var i = 0; i < categories.length; i++) {
        formOptions.push (
            <option value={categories[i]} key={categories[i]}>{categories[i]}</option>
        )
    }

    var modalBody;
    if (loading) {
        modalBody = <ClipLoader />
    } else {
        modalBody = (
            <Form>
                    <Form.Group className="mb-3">
                        <Form.Control type="text" placeholder="Exercise name" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Select disabled={newCategory} value={categoryDropdownValue} onChange={(e) => setCategoryDropdownValue(e.target.value)}>
                            <option value="" disabled>Select a category</option>
                            {formOptions}
                        </Form.Select>
                    </Form.Group>
                    <Accordion flush>
                        <CustomAccordionToggle eventKey="0" />
                        <Accordion.Collapse eventKey="0">
                            <Form.Group className="mb-3">
                                <Form.Control type="text" placeholder="New category name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}/>
                            </Form.Group>
                        </Accordion.Collapse>
                    </Accordion>
            </Form>
        )
    }

    function fetchCategoriesErrorHandler() {
        if (status !== 0 && status !== 200) {
            return {
                __html: '<Alert variant="danger">Error retrieving categories.  Status code {status}</Alert>'
            };
        }
    }

    function submitExerciseErrorHandler() {
        if (submitStatus !== 0 && submitStatus !== 200) {
            return {
                __html: '<Alert variant="danger">Error submitting exercise.  Status code {status}</Alert'
            };
        }
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create exercise <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create exercise</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div dangerouslySetInnerHTML={fetchCategoriesErrorHandler()} />
                    <div dangerouslySetInnerHTML={submitExerciseErrorHandler()} />
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

function Exercises() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(0);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await fetch('https://npkz4z37m3.execute-api.us-east-1.amazonaws.com/Prod/exercises', requestOptions);
            const response_status = await response.status;
            setStatus(response_status);
            const body = await response.json();
            setExercises(body);
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <Container>
                <h1>Exercises</h1>
                <ClipLoader />
            </Container>
        )
    } else {
        if (status !== 200) {
            return (
                <Container>
                    <h1>Exercises</h1>
                    <Alert variant="danger">Fetch failed with status code {status}.</Alert>
                </Container>
            )
        } else {
            var listGroupElements = []
            for (var i = 0; i < exercises["Exercises"].length; i++) {
                const target = "/exercises/" + exercises["Exercises"][i]
                listGroupElements.push(
                    <ListGroup.Item key={exercises["Exercises"][i]} as={Link} to={target}>
                        {exercises["Exercises"][i]}<span className="exercises-list-group-item-float-right"><FontAwesomeIcon icon={faChevronRight} /></span>
                    </ListGroup.Item>
                )
            }
            return (
                <Container>
                    <h1>Exercises</h1>
                    <ListGroup className="exercises-list-group">
                        {listGroupElements}
                    </ListGroup><br />
                    <div className="float-end">
                        <CreateExerciseModal />
                    </div>
                </Container>
            )
        }
    }
}

export default Exercises;