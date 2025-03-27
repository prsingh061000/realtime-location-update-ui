import logo from './logo.svg';
import './App.css';
import SimulationForm from './SimulationForm';
import RealTimeLocationMap from './RealTimeLocationMap';
import { useState } from 'react';

function App() {

  const [simulationStart, setSimulationStart] = useState(false);

  return (
    <div className="App">
      <h1>Producer</h1>
      <SimulationForm setSimulationStart = {setSimulationStart}/>
      <RealTimeLocationMap simulationStart = {simulationStart}/>
    </div>
  );
}

export default App;
