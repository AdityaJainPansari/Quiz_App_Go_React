import React, { Component } from 'react';
import ViewUsers from './ViewUsers';
import AvailQuiz from './AvailQuiz';
import CreateGenre from './CreateGenre';
import AddQuestion from './AddQuestions';
import NewUser from './NewUser';
import Login from './Login';
import Logout from './Logout';
import Dashboard from './Dashboard';
import LeaderBoard from './LeaderBoard';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          
          <div>
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <Link className="navbar-brand" to={'/'}>React App</Link>
                </div>
                {!JSON.parse(localStorage["auth"]).authenticated &&
                <ul className="nav navbar-nav">
                  <li><Link to={'/'}>Home</Link></li>
                  <li><Link to={'/NewUser'}>Sign Up</Link></li>
                  <li><Link to={'/Login'}>Login</Link></li>
                </ul>
                }
                {JSON.parse(localStorage["auth"]).authenticated && !JSON.parse(localStorage["auth"]).admin &&
                <ul className="nav navbar-nav">
                  <li><Link to={'/Dashboard'}>Dashboard</Link></li>
                  <li><Link to={'/LeaderBoard'}>LeaderBoard</Link></li>
                  <li><Link to={'/AvailQuiz'}>Avail Quiz</Link></li>
                  <li><Link to={'/Logout'}>Logout</Link></li>
                </ul>
                }
                {JSON.parse(localStorage["auth"]).authenticated && JSON.parse(localStorage["auth"]).admin &&
                <ul className="nav navbar-nav">
                  <li><Link to={'/Dashboard'}>Dashboard</Link></li>
                  <li><Link to={'/LeaderBoard'}>LeaderBoard</Link></li>
                  <li><Link to={'/CreateGenre'}>Add Genre</Link></li>
                  <li><Link to={'/AddQuestions'}>Add Questions</Link></li>
                  <li><Link to={'/AvailQuiz'}>Avail Quiz</Link></li>
                  <li><Link to={'/ViewUsers'}>View Users</Link></li>
                  <li><Link to={'/Logout'}>Logout</Link></li>
                </ul>
                }
              </div>
            </nav>
            <Switch>
                 <Route exact path='/CreateGenre' component={CreateGenre} />
                 <Route exact path='/AddQuestions' component={AddQuestion} />
                 <Route exact path='/AvailQuiz' component={AvailQuiz} />
                 <Route exact path='/ViewUsers' component={ViewUsers} />
                 <Route exact path='/NewUser' component={NewUser} />
                 <Route exact path='/Login' component={Login} />
                 <Route exact path='/Dashboard' component={Dashboard} />
                 <Route exact path='/LeaderBoard' component={LeaderBoard} />
                 <Route exact path='/Logout' component={Logout} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
