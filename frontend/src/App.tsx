import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ComparisonsPage from './pages/ComparisonsPage';
import MarketsPage from './pages/MarketsPage';
import SustainabilityPage from './pages/SustainabilityPage';
import DemandPoolPage from './pages/DemandPoolPage';
import LogisticsPage from './pages/LogisticsPage';
import CustomsPage from './pages/CustomsPage';
import CompetitorPage from './pages/CompetitorPage';
import TrendPage from './pages/TrendPage';

export type Page =
  | 'dashboard'
  | 'comparisons'
  | 'markets'
  | 'reports'
  | 'sustainability'
  | 'demand'
  | 'logistics'
  | 'customs'
  | 'competitor'
  | 'trend';

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header activePage={activePage} onNavigate={setActivePage} />
      <div className="flex">
        {activePage === 'markets' && <Sidebar />}
        <main className="flex-1">
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'comparisons' && <ComparisonsPage />}
          {activePage === 'markets' && <MarketsPage />}
          {activePage === 'sustainability' && <SustainabilityPage />}
          {activePage === 'demand' && <DemandPoolPage />}
          {activePage === 'logistics' && <LogisticsPage />}
          {activePage === 'customs' && <CustomsPage />}
          {activePage === 'competitor' && <CompetitorPage />}
          {activePage === 'trend' && <TrendPage />}
          {activePage === 'reports' && (
            <div className="flex items-center justify-center h-96 text-slate-400 text-lg">
              Raporlar yakında geliyor…
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
