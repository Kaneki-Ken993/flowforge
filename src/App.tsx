import Board from "@c/Board";
import Navbar from "./components/Navbar";

function App() {
  return (
      <div className="min-h-screen bg-zinc-900">
        <Navbar/>
        <Board />
      </div>
  );
}

export default App;
