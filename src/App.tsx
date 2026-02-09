import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BuildProvider } from './context/BuildContext';
import HomePage from './pages/HomePage';
import PCSimulator from './components/PCSimulator';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/simulator" 
          element={
            <BuildProvider>
              <div className="app">
                <PCSimulator />
              </div>
            </BuildProvider>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;

