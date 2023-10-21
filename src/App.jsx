import React, { useState } from 'react';
import axios from 'axios'
import Nav from './Components/NAV/Nav';
import Side from './components/Side/Side';
import CreateEsign from './components/pages/CreateEsign';
import { Route, Routes } from 'react-router-dom';
import ViewSign from './components/pages/ViewSign.';
function FileUpload() {
  

  return (
    <div>
      <Nav />
      <Side />
      <Routes>
        <Route path="/create" element={<CreateEsign />} />
        <Route path="/view" element={<ViewSign />} />
      </Routes>
    </div>
  );
}

export default FileUpload;
