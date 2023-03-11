// noinspection JSCheckFunctionSignatures

import React, {useState, useEffect} from 'react';
import {Button, Col, Container, Dropdown, Row} from "react-bootstrap";
import trackingService from "../../services/trackingService";
import {calculateAveragePointsConceded, calculateAverageScore, getTeamRecord} from "../../utils/calculations";
import ResultsSnapshot from "../ResultsSnapshot/ResultsSnapshot";

const service = new trackingService();

const TrackingScores = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    let [selectedGames, setGames] = useState('');
    const [selectedConference, setConference] = useState('');
    let [averagePointsScored, setAveragePointsScored] = useState('');
    let [averagePointsConceded, setAveragePointsConceded] = useState('');
    let [teamRecord, setTeamRecord] = useState([]);
    const [trackedTeams, setTrackedTeams] = useState([]);
    let [trackTeam, setTrackTeam] = useState(false);

    useEffect(() => {
        getTeams();

    }, []);

    async function getTeams() {
        await service.getTeams().then(response => {
            setTeams(response.data.data);
        });
    }

    const handleSelectTeam = async (team) => {
        await setSelectedTeam(team);
        await setConference(team.conference)

    };

    const handleTrackTeam = async (selectedTeam) => {

        const games = await service.getGames(selectedTeam);
        const teamId = selectedTeam.id;
        selectedGames = games.data.data.filter(game => game.home_team.id === teamId || game.visitor_team.id === teamId);
        await setGames(selectedGames);
        averagePointsScored = await calculateAverageScore(selectedGames, selectedTeam.id);
        await setAveragePointsScored(averagePointsScored)

        averagePointsConceded = await calculateAveragePointsConceded(selectedGames, selectedTeam.id);
        await setAveragePointsConceded(averagePointsConceded)


        teamRecord = await getTeamRecord(selectedTeam.id, selectedGames);
        await setTeamRecord(teamRecord);
        const isTeamTracked = trackedTeams.some((trackedTeam) => trackedTeam.selectedTeam.id === selectedTeam.id);

        if (!isTeamTracked) {
            const newTrackedTeam = {
                selectedTeam,
                selectedConference,
                teamRecord,
                averagePointsScored,
                averagePointsConceded,
                selectedGames,
            };
            await setTrackedTeams([...trackedTeams, newTrackedTeam]);
            trackTeam = true;
            await setTrackTeam(trackTeam);

        }



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


                    <Col xs lg="9">
                        <Button variant="primary" id="trackBtn" onClick={() => handleTrackTeam(selectedTeam)}>Track
                            Team</Button>
                    </Col>

                </Row>
                <br/>
                <Row>
                    <Col md="3">
                        <br/> <br/>
                        <br/>
                        {trackedTeams ?
                            trackedTeams.map((trackedTeam, index) => (
                                trackedTeam.selectedTeam && trackedTeam.selectedConference && trackedTeam.teamRecord && trackedTeam.averagePointsScored > 0 && trackedTeam.averagePointsConceded > 0 && trackedTeam.selectedGames && trackedTeam.selectedGames.length > 0 &&
                                <ResultsSnapshot
                                    key={index}
                                    selectedTeam={trackedTeam.selectedTeam}
                                    selectedConference={trackedTeam.selectedConference}
                                    teamRecord={trackedTeam.teamRecord}
                                    averagePointsScored={trackedTeam.averagePointsScored}
                                    averagePointsConceded={trackedTeam.averagePointsConceded}
                                    selectedGames={trackedTeam.selectedGames}
                                    onRemove={() => handleRemove(index)}
                                />
                            ))
                            :
                            <p>No tracked teams yet.</p>
                        }


                    </Col>

                </Row>
            </Container>
        </React.Fragment>
    );
};

export default TrackingScores;
