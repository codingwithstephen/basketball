// noinspection JSCheckFunctionSignatures

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button, Col, Container, Dropdown, Row} from "react-bootstrap";
import trackingService from "../../services/trackingService";

const service = new trackingService();

const TrackingScores = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedGames, setGames] = useState('');

    console.log(process.env.REACT_APP_GET_TEAMS);
    useEffect(() => {
             service.getTeams().then(response =>{
               setTeams(response.data.data);
             });

    }, []);

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
    };

    const handleTrackTeam = (selectedTeam)=>{
        service.getGames(selectedTeam).then(response =>{
            console.log(response)

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
                                    <Dropdown.Item key={team.id} onClick={() => handleSelectTeam(team.full_name)}>{team.full_name}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col xs lg="9">
                        <Button variant="primary" id="trackBtn" onClick={()=> handleTrackTeam(selectedTeam)}>Track Team</Button>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default TrackingScores;
