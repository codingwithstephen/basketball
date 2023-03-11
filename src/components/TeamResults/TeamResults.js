
import React from 'react';
import {Button, Card, Container, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";

const TeamResults = (props) => {
    let navigate = useNavigate();
    function routeChange() {
        let path = `/results`;
        navigate(path,
            {
                state: {
                    props
                }
            });
    }

    function getAbbreviation(){
        return props.selectedTeam.abbreviation;
    }

    return (
        <React.Fragment>
            <Container>
                <h1>Team Results</h1>
                <br/>
                <Row>
                    <Card style={{width: '18rem'}}>
                        <Card.Body>
                            <Card.Title>{props.selectedTeam.full_name} - {getAbbreviation()}</Card.Title>
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
                            <Button onClick={routeChange} variant="primary">See game results >>> </Button>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default TeamResults;
