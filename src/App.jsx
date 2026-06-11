import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Clicker from "./Components/Clicker"

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" index element={<Clicker />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
