// noinspection JSCheckFunctionSignatures

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        setSelectedTeam(team.full_name);
        setConference(team.conference)
    };

    const handleTrackTeam = (selectedTeam)=>{
        service.getGames(selectedTeam).then(response =>{
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
                                {selectedTeam || 'Select Team'}
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
                            <Card.Title>{selectedTeam}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{selectedConference} conference</Card.Subtitle>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default TrackingScores;
