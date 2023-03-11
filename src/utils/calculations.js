export async function getWinLoss(teamId, game) {
    const homeTeamWon = game.home_team_score > game.visitor_team_score;
    const awayTeamWon = game.home_team_score < game.visitor_team_score;

    if (homeTeamWon) {
        return "W";
    } else if (awayTeamWon) {
        return "L";
    }

    return "D";
}

export async function getTeamRecord(teamId, games) {
    let record = [];

    for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const winLoss = await getWinLoss(teamId, game);
        record.push(winLoss);
    }

    return record;
}

export function calculateAverageScore(games, teamId) {

    console.log(games);

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

    if (numberOfGames === 0) {
        console.log(`Team with ID ${teamId} did not play in any games.`);
    } else {
        console.log(`Team with ID ${teamId} played in ${numberOfGames} games and scored a total of ${totalScore} points.`);
    }

    return  numberOfGames > 0 ? totalScore / numberOfGames : 0;

}

export async function calculateAveragePointsConceded(games, teamId) {
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
    return  numberOfGames > 0 ? totalPointsConceded / numberOfGames : 0;
}


