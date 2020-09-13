import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import  { Redirect } from 'react-router-dom'
import './NewPerson.css';

class Dashboard extends Component{
  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/previousQuiz/'+JSON.parse(localStorage["auth"]).username);
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
  }
render(){
    return (
    <div className="App">
    {!JSON.parse(localStorage["auth"]).authenticated && <Redirect to="/Login"/>}
        <header className="App-header">
          <h1 className="App-title">Hello {JSON.parse(localStorage["auth"]).username}!</h1>
        </header>

        <table className="table-hover">
          <thead>
            <tr>
              <th>Genre</th>
              <th>Quiz No.</th>
              <th>Question Type</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map(function(item, key) {
               return (
                  <tr key = {key}>
                      <td>{item.genreName}</td>
                      <td>{item.QuizNo}</td>
                      <td>{item.QuestionType}</td>
                      <td>{item.Score}</td>
                  </tr>
                )
             })}
          </tbody>
       </table>
      </div>
    );
}
}

export default Dashboard;