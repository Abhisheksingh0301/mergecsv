// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import './App.css';
import CSVMerger from './CSVMerger'; // Import the CSVMerger component

function App() {
  return (
    <div className="App">
      <h1>CSV Merger App</h1>
      <CSVMerger /> {/* Include CSVMerger component */}
    </div>
  );
}

export default App;

