import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import './NewPerson.css';

class CreateGenre extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        genreName: "",
        noOfQuiz: "",
      },
      submitted: false,
      message: "",
    }
    this.handleGChange = this.handleGChange.bind(this);
    this.handleNChange = this.handleNChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    if(this.state.formData.noOfQuiz<=0)
    alert("No. of Quiz can not be less than 1 !")
  else{
    event.preventDefault();
    fetch('http://localhost:8080/creategenre', {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300 || response.status == 304)
        {
          this.setState({submitted: true});
          if(response.status==201)
            this.setState({message:"New genre successfully added"});
          if(response.status==304)
          this.setState({message:"Genre already exists !"});
        }
      });}
  }

  handleGChange(event) {
    this.state.formData.genreName = event.target.value;
  }
  handleNChange(event) {
      if(event.target.value<=0)
      {
        alert("No. of Quiz can not be less than 1 !")
        event.target.value=1
        this.state.formData.noOfQuiz=1
      }
      else
        this.state.formData.noOfQuiz = parseInt(event.target.value);
  }

  render() {

    return (
      <div className="App">

      {!JSON.parse(localStorage["auth"]).authenticated && <Redirect to="/Login"/>}
      {JSON.parse(localStorage["auth"]).authenticated && !JSON.parse(localStorage["auth"]).admin && <Redirect to="/Dashboard"/>}
        <header className="App-header">
          <h1 className="App-title">Create a New Genre</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label>Genre Name</label>
                <input type="text" className="form-control" value={this.state.genreName} onChange={this.handleGChange}/>
            </div>
            <div className="form-group">
                <label>No. of Quizes</label>
                <input type="number" min='1' defaultValue='1' className="form-control" value={this.state.noOfQuiz} onChange={this.handleNChange}/>
            </div>
                <button type="submit" className="btn btn-default">Submit</button>
          </form>
        </div>

        {this.state.submitted &&
          <div>
            <h2>
              {this.state.message}
            </h2>
          </div>
        }

      </div>
    );
  }
}

export default CreateGenre;
