
import React from 'react';
import { Card, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

const TeamResults = (props) => {

    return (
        <React.Fragment>
            <Container>
                <h1>Team Results</h1>
                <br/>
                <Row>
                    <Card style={{width: '18rem'}}>
                        <Card.Body>
                            <Card.Title>{props.selectedTeam.full_name} - {props.selectedTeam.full_name.trim().substr(0, 3).toUpperCase()}</Card.Title>
                            <Card.Subtitle
                                className="mb-2 text-muted">{props.selectedConference} conference</Card.Subtitle>
                            <Card.Text>
                                Results of the past 12 days
                            </Card.Text>
                            {props.teamRecord.map((game, index) => (
                                <Card.Text key={index} className={game === 'W' ? 'win' : 'loss'}>
                                    {game}
                                </Card.Text>
                            ))}

                            <Card.Img src={'https://interstate21.com/nba-logos/'+ props.selectedTeam.full_name.substr(0, 3).toUpperCase() + '.png'} ></Card.Img>
                            <Card.Text>Avg pts score: {props.averagePointsScored}</Card.Text>
                            <Card.Text>Avg pts conceded: {props.averagePointsConceded}</Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/results" variant="primary">See game results .... </Link>
                        </Card.Footer>
                    </Card>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default TeamResults;
