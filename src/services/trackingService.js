import axios from "axios";

export default class trackingService{
    getTeams(){
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

    getGames(selectedTeam){
        console.log(selectedTeam)
        const endDate = new Date().toISOString().slice(0, 10); // get today's date in YYYY-MM-DD format
        const startDate = new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // calculate date 12 days ago in YYYY-MM-DD format
        const options = {
            method: 'GET',
            url: process.env.REACT_APP_GET_GAMES,
            params: {
                page: '0',
                dates: [endDate, startDate],
                per_page: '12',
                team_ids: [selectedTeam.id]
            },
            headers: {
                'X-RapidAPI-Key': process.env.REACT_APP_API_KEY,
                'X-RapidAPI-Host': process.env.REACT_APP_GET_HOST
            }
        };
        return axios.request(options);
    }


}
