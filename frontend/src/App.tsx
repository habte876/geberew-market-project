import { useState } from 'react';
import PriceSubmissionForm from './components/PriceSubmissionForm';
import OperatorVerificationScreen from './components/OperatorVerificationScreen';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handlePriceSubmitted() {
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <PriceSubmissionForm onSubmitted={handlePriceSubmitted} />
        <OperatorVerificationScreen refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;