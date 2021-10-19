import "./App.css";
import User from "./pages/User";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {false && <img src="" className="App-logo" alt="logo" />}
        <User />
      </header>
    </div>
  );
}

export default App;
