import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ComparisonsPage from './pages/ComparisonsPage';
import MarketsPage from './pages/MarketsPage';

export type Page = 'dashboard' | 'comparisons' | 'markets' | 'reports';

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
