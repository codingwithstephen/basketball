// noinspection JSCheckFunctionSignatures

import React, {useState, useEffect} from 'react';
import {Button, Card, Col, Container, Dropdown, NavLink, Row} from "react-bootstrap";
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

    const [trackTeam, setTrackTeam] = useState(false);

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
        service.getGames(selectedTeam).then(async response => {
            setGames(response.data.data);

            const averagePointsScored = await calculateAverageScore(response.data.data, selectedTeam.id);
            setAveragePointsScored(averagePointsScored)

            const averagePointsConceded = await calculateAveragePointsConceded(response.data.data, selectedTeam.id);
            setAveragePointsConceded(averagePointsConceded)

            const teamRecord = await getTeamRecord(selectedTeam.id, selectedGames);
            setTeamRecord(teamRecord);

            setTrackTeam(true)
        });
    }

    async function getWinLoss(teamId, game) {
        const homeTeamWon = game.home_team_score > game.visitor_team_score;
        const awayTeamWon = game.home_team_score < game.visitor_team_score;

        if (homeTeamWon) {
            return "W";
        } else if (awayTeamWon) {
            return "L";
        }

        return "D";
    }

    async function getTeamRecord(teamId, games) {
        let record = [];

        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            const winLoss = await getWinLoss(teamId, game);
            record.push(winLoss);
        }

        return record;
    }

    async function calculateAverageScore(games, teamId) {
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

    async function calculateAveragePointsConceded(games, teamId) {
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
                <br/>
                <Row>
                    <br/> <br/>
                    <br/>
                    {trackTeam && selectedTeam &&
                        <Card style={{width: '18rem'}}>
                            <Card.Body>
                                <Card.Title>{selectedTeam.full_name} - {selectedTeam.full_name.trim().substr(0, 3).toUpperCase()}</Card.Title>
                                <Card.Subtitle
                                    className="mb-2 text-muted">{selectedConference} conference</Card.Subtitle>
                                <Card.Text>
                                    Results of the past 12 days
                                </Card.Text>
                                {teamRecord.map((game, index) => (
                                    <Card.Text key={index} className={game === 'W' ? 'win' : 'loss'}>
                                        {game}
                                    </Card.Text>
                                ))}

                                <Card.Img src={'https://interstate21.com/nba-logos/'+ selectedTeam.full_name.substr(0, 3).toUpperCase() + '.png'} ></Card.Img>
                                <Card.Text>Avg pts score: {averagePointsScored}</Card.Text>
                                <Card.Text>Avg pts conceded: {averagePointsConceded}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button to="/results" variant="primary">See game results .... </Button>
                            </Card.Footer>
                        </Card>
                    }

                </Row>
            </Container>
        </React.Fragment>
    );
};

export default TrackingScores;
