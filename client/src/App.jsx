import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { Outlet } from "react-router-dom";
function App() {

  return (
    <>
      <Navbar />
      <Outlet/>
    </>
  )
}

export default App
