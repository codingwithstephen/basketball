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
    let [trackTeam, setTrackTeam] = useState(false);

    useEffect(() => {
        getTeams();

    }, [ ]);

    async function getTeams() {
        await service.getTeams().then(response => {
            setTeams(response.data.data);
        });
    }

    const handleSelectTeam = async (team) => {
        await setSelectedTeam(team);
        await setConference(team.conference)
        const games = await service.getGames(selectedTeam);
        const teamId = team.id; // replace with your team's id
        const filteredGames = games.data.data.filter(game => game.home_team.id === teamId || game.visitor_team.id === teamId);
        await setGames(filteredGames);
    };

    const handleTrackTeam = async (selectedTeam) => {

        if (selectedGames.length > 0){
            const avgPointsScored = await calculateAverageScore(selectedGames, selectedTeam.id);
            await setAveragePointsScored(avgPointsScored)

            const avgPointsConceded = await calculateAveragePointsConceded(selectedGames, selectedTeam.id);
            await setAveragePointsConceded(avgPointsConceded)

            const teamGames = await getTeamRecord(selectedTeam.id, selectedGames);
            await setTeamRecord(teamGames);

            const isTeamTracked = trackedTeams.some((trackedTeam) => trackedTeam.selectedTeam.id === selectedTeam.id);

            if (!isTeamTracked) {
                const newTrackedTeam = {
                    selectedTeam,
                    selectedConference,
                    teamGames,
                    avgPointsScored,
                    avgPointsConceded,
                    selectedGames,
                };
                await setTrackedTeams([...trackedTeams, newTrackedTeam]);
                trackTeam = true;
                await setTrackTeam(trackTeam);
            } else {
                console.log('The selected team is already being tracked.');
            }
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
                        {trackedTeams && trackedTeams.length > 0 ?
                            trackedTeams.map((trackedTeam, index) => (
                                trackedTeam.selectedTeam && trackedTeam.selectedConference && trackedTeam.teamGames && trackedTeam.avgPointsScored > 0 && trackedTeam.avgPointsConceded > 0 && trackedTeam.selectedGames && trackedTeam.selectedGames.length > 0 &&
                                <TeamResults
                                    key={index}
                                    selectedTeam={trackedTeam.selectedTeam}
                                    selectedConference={trackedTeam.selectedConference}
                                    teamRecord={trackedTeam.teamGames}
                                    averagePointsScored={trackedTeam.avgPointsScored}
                                    averagePointsConceded={trackedTeam.avgPointsConceded}
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
