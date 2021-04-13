import React from 'react';
import ReactDOM from 'react-dom';
// import { BootcampsProvider } from './context/bootcampsContext';
// import { AuthProvider } from './context/authContext';
import './index.css';
import App from './App';

//
//   <React.StrictMode>
//     <AuthProvider>
//       <BootcampsProvider>
//         <App />
//       </BootcampsProvider>
//     </AuthProvider>
//   </React.StrictMode>
//

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
