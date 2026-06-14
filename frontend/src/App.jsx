import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import Copilot from "./pages/Copilot";
import CreateCampaign from "./pages/CreateCampaign";

import CampaignDetails from "./pages/CampaignDetails";

import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="flex">
        

          <main className="p-8">
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/campaigns"
                element={<Campaigns />}
              />

              <Route
                path="/copilot"
                element={<Copilot />}
              />

              <Route
                path="/create-campaign"
                element={<CreateCampaign />}
              />

              <Route
  path="/campaigns/:id"
  element={<CampaignDetails />}
/>
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;