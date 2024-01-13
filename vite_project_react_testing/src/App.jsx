import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import RoutesConfigure from "./Routes/RoutesConfigure";

function App() {
  return (
    <Router>
      <div className="app-styling">
        <RoutesConfigure />
      </div>
    </Router>
  );
}

export default App;
