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

export async function calculateAverageScore(games, teamId) {
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

    return numberOfGames > 0 ? totalScore / numberOfGames : 0;

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


