import './App.css';
import TrackingScores from "./components/TrackingScores/TrackingScores";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Results from "./components/Results/Results";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TrackingScores/>}/>
                <Route path="/results" element={<Results/>}/>
                <Route path="/results/:teamCode" element={<Results/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
