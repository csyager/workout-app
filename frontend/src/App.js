import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  Switch,
  Route,
  BrowserRouter as Router
} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/calendar">
            {/* <Calendar /> */}
          </Route>
          <Route path="/exercises">
            {/* <Exercises /> */}
          </Route>
          <Route path="/workout">
            {/* <Workout /> */}
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
