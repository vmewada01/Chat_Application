import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { ChatProvider } from "./Providers/ChatProvider";
import RoutesConfigure from "./Routes/RoutesConfigure";

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <RoutesConfigure />
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
