import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Add other routes like Dashboard later */}
    </Routes>
  );
};

export default App;
