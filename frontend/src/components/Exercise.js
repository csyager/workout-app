import {
    useParams
} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import ClipLoader from 'react-spinners/ClipLoader';
import {
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line
} from 'recharts';

function Exercise() {
    let { exerciseName } = useParams();
    const [loading, setLoading] = useState(false);
    const [sets, setSets] = useState([])
    const [status, setStatus] = useState(0);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        async function fetchSets() {
            setLoading(true);
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await fetch('https://npkz4z37m3.execute-api.us-east-1.amazonaws.com/Prod/exercises/' + encodeURIComponent(exerciseName) + '?limit=' + limit, requestOptions);
            const responseStatus = await response.status;
            setStatus(responseStatus);
            const body = await response.json();
            setSets(body["sets"]);
            setLoading(false);
        }
        fetchSets();
    }, [exerciseName, limit])

    var setData = [];
    for (var i = 0; i < sets.length; i++) {
        let set = sets[i];
        setData.push(
            {
                "date": set["SetDate"],
                "metricAmount": parseInt(set["MetricAmount"]),
                "reps": parseInt(set["Reps"]),
                "metric": set["Metric"],
                "setNumber": set["SetNumber"]
            }
        )
    }
    setData = setData.sort((a, b) => {
        if (a["date"] < b["date"]) {
            return -1;
        } else if (a["date"] === b["date"] && a["setNumber"] < b["setNumber"]) {
            return -1
        } else {
            return 1;
        }
    });
    console.log(setData);

    var tableRows = []
    for (var j = setData.length-1; j >=0; j--) {
        tableRows.push(
            <tr key={setData[j]["date"] + '-' + setData[j]["setNumber"]}>
                <td>{setData[j]["date"]}</td>
                <td>{setData[j]["setNumber"]}</td>
                <td>{setData[j]["metricAmount"]}</td>
                <td>{setData[j]["metric"]}</td>
                <td>{setData[j]["reps"]}</td>
            </tr>
        )
    }

    // error handling
    function fetchSetsErrorHandler() {
        if (status !== 0 && status !== 200) {
            return {
                __html: '<div role="alert" class="alert alert-danger">Error retrieving sets.  Status code {status}</div>'
            };
        }
    }

    return (
        <>
        <Container>
             <h1>{exerciseName}</h1>
             <ClipLoader loading={loading} />
             <div dangerouslySetInnerHTML={fetchSetsErrorHandler()} />
        </Container>
        <LineChart width={380} height={400} data={setData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" type="category" angle="45" tickMargin="40" height={120} />
            <YAxis yAxisId="left-axis" type="number" domain={['dataMin', 'dataMax']} />
            <YAxis yAxisId="right-axis" orientation="right" type="number" dataKey="reps" domain={[0, 'auto']} />
            <Tooltip />
            <Legend margin={{ top: 30 }} />
            <Line type="monotone" dataKey="metricAmount" stroke="#8884d8" yAxisId="left-axis" dot={{stroke: "#8884d8", strokeWidth: 2}} />
            <Line type="monotone" dataKey="reps" stroke="#82ca9d" yAxisId="right-axis" />
        </LineChart>
        <Container>
            <Row>
                <Col xs={6}>
                    <Form.Label className="me-sm-2" htmlFor="limit-select">No. of points</Form.Label>
                </Col>
                <Col xs={6}>
                    <Form.Select id="limit-select" value={limit} onChange={(e) => setLimit(e.target.value)}>
                        <option value="" disabled>Select a limit</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                    </Form.Select>
                </Col>
            </Row>
        </Container>
        <Container>
            <Table responsive>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Set #</th>
                        <th>Metric Amt.</th>
                        <th>Metric</th>
                        <th>Reps</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </Table>
        </Container>
        </>
    )
}

export default Exercise;