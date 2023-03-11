import axios from "axios";

export default class trackingService{
    async getTeams(){
        const options = {
            method: 'GET',
            url: process.env.REACT_APP_GET_TEAMS,
            params: {page: '0'},
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
                'X-RapidAPI-Host': process.env.REACT_APP_GET_HOST
            }
        };
        return axios.request(options);
    };

    async getGames(team){
        const endDate = new Date().toISOString().slice(0, 10);
        const startDate = new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        console.log(endDate);
        console.log(startDate);
        const options = {
            method: 'GET',
            url: process.env.REACT_APP_GET_GAMES,
            params: {
                page: [0],
                dates: ['2023-03-11T00:00:00.000Z',
                    '2023-03-10T00:00:00.000Z',
                    '2023-03-09T00:00:00.000Z',
                    '2023-03-08T00:00:00.000Z',
                    '2023-03-07T00:00:00.000Z',
                    '2023-03-06T00:00:00.000Z',
                    '2023-03-05T00:00:00.000Z',
                    '2023-03-04T00:00:00.000Z',
                    '2023-03-03T00:00:00.000Z',
                    '2023-03-02T00:00:00.000Z',
                    '2023-03-01T00:00:00.000Z',
                    '2023-02-28T00:00:00.000Z'],
                per_page: 12,
                team_ids: [team.id]
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
                'X-RapidAPI-Host': process.env.REACT_APP_GET_HOST
            }
        };
        return axios.request(options);
    }


}
