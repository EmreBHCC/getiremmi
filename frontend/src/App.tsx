import { useState } from 'react';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import ComparisonsPage, { Urun } from './pages/ComparisonsPage';
import MarketsPage from './pages/MarketsPage';
import SustainabilityPage from './pages/SustainabilityPage';
import DemandPoolPage from './pages/DemandPoolPage';
import LogisticsPage from './pages/LogisticsPage';
import CustomsPage from './pages/CustomsPage';
import CompetitorPage from './pages/CompetitorPage';
import TrendPage from './pages/TrendPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

export type Page =
  | 'dashboard'
  | 'comparisons'
  | 'markets'
  | 'sustainability'
  | 'demand'
  | 'logistics'
  | 'customs'
  | 'competitor'
  | 'trend'
  | 'settings'
  | 'profile';

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [selectedUrun, setSelectedUrun] = useState<Urun | null>(null);

  const handleProductSelect = (urun: Urun) => {
    setSelectedUrun(urun);
    setActivePage('markets');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header activePage={activePage} onNavigate={setActivePage} />
      <div className="flex">
        <main className="flex-1">
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'comparisons' && <ComparisonsPage onNavigate={setActivePage} onProductSelect={handleProductSelect} />}
          {activePage === 'markets' && <MarketsPage urun={selectedUrun} />}
          {activePage === 'sustainability' && <SustainabilityPage />}
          {activePage === 'demand' && <DemandPoolPage />}
          {activePage === 'logistics' && <LogisticsPage />}
          {activePage === 'customs' && <CustomsPage />}
          {activePage === 'competitor' && <CompetitorPage />}
          {activePage === 'trend' && <TrendPage />}
          {activePage === 'settings' && <SettingsPage />}
          {activePage === 'profile' && <ProfilePage />}
        </main>
      </div>
    </div>
  );
}

export default App;
