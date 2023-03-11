import React from 'react';
import {Button, Card, Container, Row} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";

const Results = () => {
    let navigate = useNavigate();
    function routeChange() {
        let path = `/`;
        navigate(path);
    }

    const buttonText = "<< Back to all team stats";

    const {state} = useLocation();
    function getAbbreviation(){
        return state.props.selectedTeam.abbreviation;
    }

    console.log(state)

    return (
        <React.Fragment>
            <Container>
                <h1>Results</h1>
                <br/>
                <Row>
                    <Card style={{width: '18rem'}}>

                        <Card.Body>
                            <Card.Title>{state.props.selectedTeam.full_name} - {getAbbreviation()}</Card.Title>
                            <Card.Subtitle
                                className="mb-2 text-muted">{state.props.selectedTeam.conference} conference</Card.Subtitle>
                            {state.props.selectedGames.map((game, index) => (
                                <Card.Text key={index}>
                                    <strong>{game.home_team.abbreviation}</strong> {game.home_team_score} - {game.visitor_team_score}
                                    <strong> {game.visitor_team.abbreviation}</strong>

                                </Card.Text>
                            ))}
                            <Button onClick={routeChange} variant="primary"> {buttonText} </Button>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </React.Fragment>
    );
};

export default Results;
