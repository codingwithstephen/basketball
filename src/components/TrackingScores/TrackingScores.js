// noinspection JSCheckFunctionSignatures

import React, {useState, useEffect} from 'react';
import {Button, Col, Container, Dropdown, Row} from "react-bootstrap";
import trackingService from "../../services/trackingService";
import {calculateAveragePointsConceded, calculateAverageScore, getTeamRecord} from "../../utils/calculations";
import TeamResults from "../TeamResults/TeamResults";

const service = new trackingService();

const TrackingScores = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedGames, setGames] = useState('');
    const [selectedConference, setConference] = useState('');
    const [averagePointsScored, setAveragePointsScored] = useState('');
    const [averagePointsConceded, setAveragePointsConceded] = useState('');
    const [teamRecord, setTeamRecord] = useState([]);
    const [trackedTeams, setTrackedTeams] = useState([]);
    const [trackTeam, setTrackTeam] = useState(false);

    useEffect(() => {
        service.getTeams().then(response => {
            setTeams(response.data.data);
        });

    }, [ ]);

    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
        setConference(team.conference)
    };

    const handleTrackTeam = (selectedTeam) => {
        service.getGames(selectedTeam).then(async response => {
            setGames(response.data.data);

            const averagePointsScored = await calculateAverageScore(response.data.data, selectedTeam.id);
            setAveragePointsScored(averagePointsScored)

            const averagePointsConceded = await calculateAveragePointsConceded(response.data.data, selectedTeam.id);
            setAveragePointsConceded(averagePointsConceded)

            const teamRecord = await getTeamRecord(selectedTeam.id, selectedGames);
            setTeamRecord(teamRecord);

            const isTeamTracked = trackedTeams.some((trackedTeam) => trackedTeam.selectedTeam.id === selectedTeam.id);

            if (!isTeamTracked) {
                service.getGames(selectedTeam).then(async (response) => {
                    setGames(response.data.data);
                    const newTrackedTeam = {
                        selectedTeam,
                        selectedConference,
                        teamRecord,
                        averagePointsScored,
                        averagePointsConceded,
                        selectedGames,
                    };
                    setTrackedTeams([...trackedTeams, newTrackedTeam]);
                    setTrackTeam(true);
                });
            } else {
                console.log('The selected team is already being tracked.');
            }

        });
    }

    const handleRemove = (index) => {
        setTrackedTeams(trackedTeams.filter((_, i) => i !== index));
    };

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
                                {teams?.map(team => (
                                    <Dropdown.Item key={team.id}
                                                   onClick={() => handleSelectTeam(team)}>{team.full_name}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>

                    {selectedTeam &&
                        <Col xs lg="9">
                            <Button variant="primary" id="trackBtn" onClick={() => handleTrackTeam(selectedTeam)}>Track
                                Team</Button>
                        </Col>}

                </Row>
                <br/>
                <Row>
                    <Col md="3">
                        <br/> <br/>
                        <br/>
                        {trackedTeams.map((trackedTeam, index) => (
                            <TeamResults
                                key={index}
                                selectedTeam={trackedTeam.selectedTeam}
                                selectedConference={trackedTeam.selectedConference}
                                teamRecord={trackedTeam.teamRecord}
                                averagePointsScored={trackedTeam.averagePointsScored}
                                averagePointsConceded={trackedTeam.averagePointsConceded}
                                selectedGames={trackedTeam.selectedGames}
                                onRemove={() => handleRemove(index)}
                            />
                        ))}

                    </Col>

                </Row>
            </Container>
        </React.Fragment>
    );
};

export default TrackingScores;
