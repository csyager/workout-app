import Calendar from 'react-calendar'
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';
import ClipLoader from "react-spinners/ClipLoader";

function DateView(props) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(200);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (props.date !== "") {
                setLoading(true);
                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                };
                const response = await fetch('https://npkz4z37m3.execute-api.us-east-1.amazonaws.com/Prod/set?date=' + props.date, requestOptions);
                const response_status = await response.status;
                setStatus(response_status);
                const body = await response.json();
                setExercises(body);
                setLoading(false);
            }
        }
        fetchData();
    }, [props.date])
    
    if (loading) {
        return (
            <Container>
                <h1>{props.date}</h1>
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
                    <Accordion.Item eventKey={exercise_name}>
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
                    <h1>{props.date}</h1>
                    <Accordion>
                        {items}
                    </Accordion>
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

function CalendarPage() {
    const [date, setDate] = useState("");

    const onClickHandler = (value, event) => {
        var formattedDate = value.toISOString().slice(0,10);
        setDate(formattedDate);
    }

    return (
        <>
            <Calendar 
                calendarType="US"
                onChange={onClickHandler}
            />
            <DateView date={date} />
        </>
    )
}

export default CalendarPage;