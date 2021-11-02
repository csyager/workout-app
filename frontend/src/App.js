import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  Switch,
  Route,
  BrowserRouter as Router
} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import CalendarPage from "./components/Calendar"
import Exercises from "./components/Exercises"
import Workout from "./components/Workout"

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/calendar">
            <CalendarPage />
          </Route>
          <Route path="/exercises">
            <Exercises />
          </Route>
          <Route path="/workout">
            <Workout />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
