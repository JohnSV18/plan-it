import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components
import Home from "./components/home/Home";
import Availability from './components/Availability/Availability';


import DisplayAvailResults from './components/DisplayAvailability/DisplayAvailResults';

//styles
import './App.css';



const App: React.FC = () => {
  return (
    <Router>
      <div className="App">

        <main id='modalRoot'>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/availability/:id" element={ <Availability />}/>
            <Route path="/results/:id" element={ <DisplayAvailResults />} />
          </Routes>
        </main>
      </div>

    </Router>
  );
}

export default App;
