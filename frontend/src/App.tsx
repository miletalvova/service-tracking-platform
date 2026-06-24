import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import PageFooter from "./components/PageFooter";
import './styles/index.css'

function App() {
  return (
    <BrowserRouter>
    <div className="app">
      <Navbar />
      <main className="content">
      <AppRoutes />
      </main>
      <PageFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;