import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/HomePage.jsx";
import Signup from "./pages/SignUpPage.jsx";
import Login from "./pages/LoginPage.jsx";
import QRRush from "./pages/QRRushPage.jsx";
import GameOverSuccess from "./pages/GameOverSuccessPage.jsx";
import GameOverElimination from "./pages/GameOverEliminationPage.jsx";
import PuzzlePage from "./pages/PuzzlePage.jsx";
import NextStepPage from "./pages/NextStepPage.jsx";
import LockerChallenge from "./pages/LockerChallengePage.jsx";
import LockerReveal from "./pages/LockerRevealPage.jsx";
import Game1 from "./pages/Game1Page.jsx";
import Game2 from "./pages/Game2Page.jsx";
import Game3 from "./pages/Game3Page.jsx";
import Game4 from "./pages/Game4Page.jsx";
import Puzzle1 from "./pages/Puzzle1Page.jsx";
import Puzzle2 from "./pages/Puzzle2Page.jsx";
import Puzzle3 from "./pages/Puzzle3Page.jsx";
import Puzzle4 from "./pages/Puzzle4Page.jsx";
import Puzzle5 from "./pages/Puzzle5Page.jsx";
import VictoryPage from "./pages/VictoryPage.jsx";
import GenerateTeamPage from "./pages/GenerateTeamPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import Team from "./pages/TeamPage.jsx";
import PlayerSignPage from "./pages/PlayerSignPage";
import DeclareSignPage from "./pages/DeclareSignPage.jsx";
import LeaderboardGame1 from "./pages/LeaderboardGame1.jsx";
import LeaderboardGame2 from "./pages/LeaderboardGame2.jsx";
import LeaderboardGame3 from "./pages/LeaderboardGame3.jsx";
import LeaderboardGame4 from "./pages/LeaderboardGame4.jsx";

import WinnerValidation from "./pages/WinnerValidation";
import FinalPhase from "./pages/FinalPhase";

//hooks
import useViewportHeight from "./hooks/UseViewportHeight.jsx";
import "./styles/main.scss";

function App() {
  useViewportHeight();
  return (
    <Router>
      <Routes>
        <Route
          path="/team"
          element={
            <Team currentPlayerId={parseInt(localStorage.getItem("userId"))} />
          }
        />
        <Route path="/game/:teamId/:playerId" element={<GamePage />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/game1" element={<Game1 />} />
        <Route path="/qr-rush" element={<QRRush />} />
        <Route path="/game-over" element={<GameOverElimination />} />
        <Route path="/success" element={<GameOverSuccess />} />
        <Route path="/leaderboard-game1" element={<LeaderboardGame1 />} />

        <Route path="/game2" element={<Game2 />} />
        <Route path="/puzzle-page" element={<PuzzlePage />} />
        <Route path="/next-step" element={<NextStepPage />} />
        <Route path="/locker-challenge" element={<LockerChallenge />} />
        <Route path="/locker-reveal" element={<LockerReveal />} />
        <Route path="/leaderboard-game2" element={<LeaderboardGame2 />} />

        <Route path="/game3" element={<Game3 />} />
        <Route path="/puzzle1" element={<Puzzle1 />} />
        <Route path="/puzzle2" element={<Puzzle2 />} />
        <Route path="/puzzle3" element={<Puzzle3 />} />
        <Route path="/puzzle4" element={<Puzzle4 />} />
        <Route path="/puzzle5" element={<Puzzle5 />} />
        <Route path="/leaderboard-game3" element={<LeaderboardGame3 />} />

        <Route path="/game4" element={<Game4 />} />
        <Route path="/team" element={<Team />} />
        <Route path="/generate-team" element={<GenerateTeamPage />} />
        <Route path="/player-sign" element={<PlayerSignPage />} />
        <Route path="/declare-sign" element={<DeclareSignPage />} />
        <Route path="/leaderboard-game4" element={<LeaderboardGame4 />} />

        {/* other pages */}
        <Route path="/winner-validation" element={<WinnerValidation />} />
        <Route path="/final-phase" element={<FinalPhase />} />
        <Route path="/victory" element={<VictoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
