import React, { Component } from 'react';
import './ViewPeople.css';

class LeaderBoard extends Component {
  constructor() {
    super();
    this.state = {
        formData: {
            genreName: "",
            QuizNo: "1",
          },
      data: [],
      genres: [],
    }
    this.handleGChange = this.handleGChange.bind(this);
    this.handleQNChange = this.handleQNChange.bind(this);
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/genre/');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({genres: data}));
    console.log(this.state.genres)
    // const request = new Request('http://127.0.0.1:8080/leaderboard/');
    // fetch(request)
    //   .then(response => response.json())
    //     .then(data => this.setState({data: data}));
  }
  
  handleGChange(event) {
    this.state.formData.genreName = event.target.value;
    var i
    for(i=0;i<this.state.genres.length;i++)
    {
        console.log(this.state.genres[i].noOfQuiz)
        if(this.state.genres[i].genreName==this.state.formData.genreName)
            this.setState({maxQuizNo:this.state.genres[i].noOfQuiz})
    }

    console.log(this.state.formData.genreName)
    this.state.formData.QuizNo = 1;
    const request = new Request('http://127.0.0.1:8080/leaderboard/'+this.state.formData.genreName+"/"+this.state.formData.QuizNo);
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
    this.setState({QuizNo: this.state.formData.QuizNo})
}

handleQNChange(event) {
    this.state.formData.QuizNo = parseInt(event.target.value);
    const request = new Request('http://127.0.0.1:8080/leaderboard/'+this.state.formData.genreName+"/"+this.state.formData.QuizNo);
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
    this.setState({QuizNo: event.target.value})
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Leader Board</h1>
        </header>
        <br/><br/>
        <div className="form-group">
            <label>Select Genre : </label>
            <select onChange={this.handleGChange}>
            <option key='0' >Select Genre</option>
            {this.state.genres.map(function(item) {
            return (
                    <option key={item.id} value={item.genreName}>{item.genreName}</option>
            )})}
            </select>
        </div>
        {(this.state.formData.genreName!="Select Genre" && this.state.formData.genreName!="") &&
        <div className="form-group">
            <label>Select Quiz No.</label> &nbsp;  &nbsp; 
            <input type="number" min='1' max={this.state.maxQuizNo} defaultValue='1' value={this.state.QuizNo} onChange={this.handleQNChange}/> &nbsp;  &nbsp; Out of {this.state.maxQuizNo} quiz available for this genre
            <br/>
        </div>
        }
        {(this.state.formData.genreName!="Select Genre" && this.state.formData.genreName!="") && this.state.QuizNo!="" &&
        <table className="table-hover">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Question Type</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map(function(item, key) {
               return (
                  <tr key = {key}>
                      <td>{item.User}</td>
                      <td>{item.QuestionType}</td>
                      <td>{item.Score}</td>
                  </tr>
                )
             })}
          </tbody>
       </table>
        }
      </div>
    );
  }
}

export default LeaderBoard;
