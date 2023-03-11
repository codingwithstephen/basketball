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
    getLastXDays(x) {
        const dates = [];
        for (let i = 0; i < x; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            dates.push(`${dateString}T00:00:00.000Z`);
        }
        return dates;
    }



    async getGames(team){
        const endDate = new Date().toISOString().slice(0, 10);
        const startDate = new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const days = this.getLastXDays(12);
        console.log(endDate);
        console.log(startDate);
        const options = {
            method: 'GET',
            url: process.env.REACT_APP_GET_GAMES,
            params: {
                page: [0],
                dates: days,
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
