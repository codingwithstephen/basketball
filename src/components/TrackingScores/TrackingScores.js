// noinspection JSCheckFunctionSignatures

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button, Col, Container, Dropdown, Row} from "react-bootstrap";

const TrackingScores = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');

    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'https://free-nba.p.rapidapi.com/teams',
            params: {page: '0'},
            headers: {
                'X-RapidAPI-Key': 'bb70788702msh386adbdc7c5f950p120c18jsnb688cad32e80',
                'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'
            }
        };
        axios.request(options)
            .then(function (response) {
                setTeams(response.data.data);
                console.log(response)
            }).catch(function (error) {
            console.error(error);
        });
    }, []);

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
    };

    const handleTrackTeam = (selectedTeam)=>{
        console.log(selectedTeam);
        const endDate = new Date().toISOString().slice(0, 10); // get today's date in YYYY-MM-DD format
        const startDate = new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // calculate date 12 days ago in YYYY-MM-DD format
        const options = {
            method: 'GET',
            url: 'https://free-nba.p.rapidapi.com/games',
            params: {
                page: '0',
                dates: [endDate, startDate],
                per_page: '12',
                team_ids: [selectedTeam.id]
            },
            headers: {
                'X-RapidAPI-Key': 'bb70788702msh386adbdc7c5f950p120c18jsnb688cad32e80',
                'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'
            }
        };
        axios.request(options)
            .then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
            console.error(error);
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
