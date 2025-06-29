import { useState } from 'react';
import WelcomePage from './components/pages/WelcomePage';
import IntroPage from './components/pages/IntroPage';
import OverviewPage from './components/pages/OverviewPage';
import BitStreamPage from './components/pages/BitStreamPage';
import SourceEncodingPage from './components/pages/SourceEncodingPage';
import ModulationPage from './components/pages/ModulationPage';
import ChannelEncodingPage from './components/pages/ChannelEncodingPage';
import MediumPropagationPage from './components/pages/MediumPropagationPage';
import ChannelDecodingPage from './components/pages/ChannelDecodingPage';
import DemodulationPage from './components/pages/DemodulationPage';
import SourceDecodingPage from './components/pages/SourceDecodingPage';
import FinalBitStreamPage from './components/pages/FinalBitStreamPage';
import SummaryPage from './components/pages/SummaryPage';

function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const goToNextPage = () => {
    setCurrentPage(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
    window.scrollTo(0, 0);
  };

  const restartJourney = () => {
    setCurrentPage(0);
    window.scrollTo(0, 0);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return <WelcomePage onNext={goToNextPage} />;
      case 1:
        return <IntroPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 2:
        return <OverviewPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 3:
        return <BitStreamPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 4:
        return <SourceEncodingPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 5:
        return <ModulationPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 6:
        return <ChannelEncodingPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 7:
        return <MediumPropagationPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 8:
        return <ChannelDecodingPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 9:
        return <DemodulationPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 10:
        return <SourceDecodingPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 11:
        return <FinalBitStreamPage onNext={goToNextPage} onBack={goToPreviousPage} />;
      case 12:
        return <SummaryPage onRestart={restartJourney} onBack={goToPreviousPage} />;
      default:
        return <WelcomePage onNext={goToNextPage} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;
