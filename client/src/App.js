import './App.css';
import Register from './components/Register';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Upload from './components/Upload';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'http://localhost:7000/graphql'
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
          <Routes>
            <Route exact path="/register" element={<Register/>} />
            <Route exact path="/" element={<Login/>} />
            <Route exact path="/homepage" element={<HomePage/>} />
            <Route exact path="/upload" element={<Upload/>} />
          </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
