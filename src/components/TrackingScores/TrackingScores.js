// noinspection JSCheckFunctionSignatures

import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Container, Dropdown, Row} from "react-bootstrap";
import trackingService from "../../services/trackingService";

const service = new trackingService();

const TrackingScores = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedGames, setGames] = useState('');
    const [selectedConference, setConference] = useState('');
    const [averagePointsScored, setAveragePointsScored] = useState('');
    const [averagePointsConceded, setAveragePointsConceded] = useState('');
    const [teamRecord, setTeamRecord] = useState([]);

    console.log(process.env.REACT_APP_GET_TEAMS);
    useEffect(() => {
        service.getTeams().then(response => {
            console.log(response.data.data)
            setTeams(response.data.data);
        });

    }, []);

    const handleSelectTeam = (team) => {
        console.log(team)
        setSelectedTeam(team);
        setConference(team.conference)
    };

    const handleTrackTeam = (selectedTeam) => {
        console.log(selectedTeam);
        service.getGames(selectedTeam).then(response => {
            console.log(response.data.data);
            setGames(response.data.data);

            const averagePointsScored = calculateAverageScore(response.data.data, selectedTeam.id);
            setAveragePointsScored(averagePointsScored)

            const averagePointsConceded = calculateAveragePointsConceded(response.data.data, selectedTeam.id);
            setAveragePointsConceded(averagePointsConceded)
            console.log(averagePointsConceded);

            const teamRecord = getTeamRecord(selectedTeam.id, selectedGames);
            console.log(teamRecord);
            setTeamRecord(teamRecord);
        });
    }

    function getWinLoss(teamId, game) {
        var homeTeamWon = game.home_team_score > game.visitor_team_score;
        var isHomeTeam = game.home_team.id === teamId;

        if (isHomeTeam && homeTeamWon) {
            return "W";
        } else if (isHomeTeam && !homeTeamWon) {
            return "L";
        } else if (!isHomeTeam && !homeTeamWon) {
            return "W";
        } else {
            return "L";
        }
    }

    function getTeamRecord(teamId, games) {
        var record = [];

        for (var i = 0; i < games.length; i++) {
            var game = games[i];
            var winLoss = getWinLoss(teamId, game);
            record.push(winLoss);
        }

        return record;
    }

    function calculateAverageScore(games, teamId) {
        let totalScore = 0;
        let numberOfGames = 0;

        games.forEach((game) => {
            if (game.home_team.id === teamId) {
                totalScore += game.home_team_score;
                numberOfGames++;
            } else if (game.visitor_team.id === teamId) {
                totalScore += game.visitor_team_score;
                numberOfGames++;
            }
        });


        const averageScore = numberOfGames > 0 ? totalScore / numberOfGames : 0;

        return averageScore;
    }

    function calculateAveragePointsConceded(games, teamId) {
        let totalPointsConceded = 0;
        let numberOfGames = 0;

        games.forEach((game) => {
            if (game.home_team.id === teamId) {
                totalPointsConceded += game.visitor_team_score;
                numberOfGames++;
            } else if (game.visitor_team.id === teamId) {
                totalPointsConceded += game.home_team_score;
                numberOfGames++;
            }
        });

        const averagePointsConceded = numberOfGames > 0 ? totalPointsConceded / numberOfGames : 0;

        return averagePointsConceded;
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
                <Row>

                    {selectedTeam &&
                        <Card style={{width: '18rem'}}>
                            <Card.Body>
                                <Card.Title>{selectedTeam.full_name}</Card.Title>
                                <Card.Subtitle
                                    className="mb-2 text-muted">{selectedConference} conference</Card.Subtitle>
                                <Card.Text>
                                    Results of the past 12 days
                                </Card.Text>
                                {teamRecord.map((game, index) => (
                                    <Card.Text key={index} className={teamRecord[index] === "W" ? "text-green" : "text-red"}>{game}</Card.Text>
                                ))}

                                <Card.Text>Avg pts score: {averagePointsScored}</Card.Text>
                                <Card.Text>Avg pts conceded: {averagePointsConceded}</Card.Text>
                            </Card.Body>
                        </Card>
                    }

                </Row>
            </Container>
        </React.Fragment>
    );
};

export default TrackingScores;
