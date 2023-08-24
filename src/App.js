import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Homepage from './Pages/Homepage';
import Coinpage from './Pages/Coinpage';
import { makeStyles } from '@material-ui/core';
import LiveCoinpage from './Pages/LiveCoinpage';

const useStyles = makeStyles(() => ({
  app: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.app}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/coins/:id" element={<Coinpage />} />
          <Route path="/coins/live/:id" element={<LiveCoinpage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
