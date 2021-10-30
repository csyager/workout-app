import Calendar from 'react-calendar'
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import ClipLoader from "react-spinners/ClipLoader";

function DateView(props) {
    useEffect(() => {
        console.log(props.date);
    })
    return (
        <Container>
            <h1>{props.date}</h1>
        </Container>
        
    )
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