// noinspection JSCheckFunctionSignatures

import React, { useState, useEffect } from 'react';
import {Button, Card, Col, Container, Dropdown, Row} from "react-bootstrap";
import trackingService from "../../services/trackingService";

const service = new trackingService();

const TrackingScores = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedGames, setGames] = useState('');
    const [selectedConference, setConference] = useState('');

    console.log(process.env.REACT_APP_GET_TEAMS);
    useEffect(() => {
             service.getTeams().then(response =>{
                 console.log(response.data.data)
               setTeams(response.data.data);
             });

    }, []);

    const handleSelectTeam = (team) => {
        console.log(team)
        setSelectedTeam(team);
        setConference(team.conference)
    };

    const handleTrackTeam = (selectedTeam)=>{
        console.log(selectedTeam);
        service.getGames(selectedTeam).then(response =>{
            console.log(response.data.data);
            setGames(response.data.data);
        });
    }

    return (
        <React.Fragment>
            <Container>
                <h1>Tracking Scores</h1>
                <Row>
                    <Col md="2">
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {selectedTeam.full_name || 'Select Team'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu id="teamSelect">
                                {teams.map(team => (
                                    <Dropdown.Item key={team.id} onClick={() => handleSelectTeam(team)}>{team.full_name}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col xs lg="9">
                        <Button variant="primary" id="trackBtn" onClick={()=> handleTrackTeam(selectedTeam)}>Track Team</Button>
                    </Col>
                </Row>
                <Row>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>{selectedTeam.full_name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{selectedConference} conference</Card.Subtitle>
                            <Card.Text>
                                Results of the past 12 days
                            </Card.Text>
                            <Card.Text>Avg pts score: 109</Card.Text>
                            <Card.Text>Avg pts conceded: 113</Card.Text>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default TrackingScores;
