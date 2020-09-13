import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import './NewPerson.css';

class AddQuestion extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        genreName: "",
        QuizNo: "",
        QuestionType: "single",
        Question: "",
        Option1: "",
        Option2: "",
        Option3: "",
        Option4: "",
        Answer: "1",
        Answer1: false,
        Answer2: false,
        Answer3: false,
        Answer4: false,
      },
      submitted: false,
      message: "",
      genres: [],
      maxQuizNo: 1,
      QuestionType : "single",
    }
    this.handleGChange = this.handleGChange.bind(this);
    this.handleQNChange = this.handleQNChange.bind(this);
    this.handleQTChange = this.handleQTChange.bind(this);
    this.handleQuesChange = this.handleQuesChange.bind(this);
    this.handleOption1Change = this.handleOption1Change.bind(this);
    this.handleOption2Change = this.handleOption2Change.bind(this);
    this.handleOption3Change = this.handleOption3Change.bind(this);
    this.handleOption4Change = this.handleOption4Change.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleAnswer1Change = this.handleAnswer1Change.bind(this);
    this.handleAnswer2Change = this.handleAnswer2Change.bind(this);
    this.handleAnswer3Change = this.handleAnswer3Change.bind(this);
    this.handleAnswer4Change = this.handleAnswer4Change.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    event.preventDefault();
    fetch('http://localhost:8080/addques', {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300)
        {
          this.setState({submitted: true});
          if(response.status==201)
            this.setState({message:"New question successfully added"});
        }
      });
  }

  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/genre/');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({genres: data}));
    console.log(this.state.genres)
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
  }
  handleQNChange(event) {
    this.state.formData.QuizNo = parseInt(event.target.value);
  }
  handleQTChange(event) {
    this.state.formData.QuestionType = event.target.value;
    this.setState({QuestionType: event.target.value})
  }
  handleQuesChange(event) {
    this.state.formData.Question = event.target.value;
  }
  handleOption1Change(event) {
    this.state.formData.Option1 = event.target.value;
  }
  handleOption2Change(event) {
    this.state.formData.Option2 = event.target.value;
  }
  handleOption3Change(event) {
    this.state.formData.Option3 = event.target.value;
  }
  handleOption4Change(event) {
    this.state.formData.Option4 = event.target.value;
  }
  handleAnswerChange(event) {
    this.state.formData.Answer = event.target.value;
  }
  handleAnswer1Change(event) {
    this.state.formData.Answer1 = event.target.checked;
  }
  handleAnswer2Change(event) {
    this.state.formData.Answer2 = event.target.checked;
  }
  handleAnswer3Change(event) {
    this.state.formData.Answer3 = event.target.checked;
  }
  handleAnswer4Change(event) {
    this.state.formData.Answer4 = event.target.checked;
  }

  render() {

    return (
      <div className="App">
      {!JSON.parse(localStorage["auth"]).authenticated && <Redirect to="/Login"/>}
      {JSON.parse(localStorage["auth"]).authenticated && !JSON.parse(localStorage["auth"]).admin && <Redirect to="/Dashboard"/>}
        <header className="App-header">
          <h1 className="App-title">Create a New Question</h1>
        </header>
        <br/><br/>
        <div className="formContainer">
          <form onSubmit={this.handleSubmit}>
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
            <label>Question Type : </label>
            <select onChange={this.handleQTChange}>
              <option value="single">Single Correct</option>
              <option value="multiple">Multiple Correct</option>
            </select>
        </div>

        }
        {(this.state.formData.genreName!="Select Genre" && this.state.formData.genreName!="") && this.state.QuizNo!="" &&
        <div className="form-group">
          <label>Question :</label>
          <input type="text" value={this.state.Question} onChange={this.handleQuesChange} required/>
          <br/>
          <label>Option 1 :</label>
          <input type="text" value={this.state.Option1} onChange={this.handleOption1Change} required/>
          <br/>
          <label>Option 2 :</label>
          <input type="text" value={this.state.Option2} onChange={this.handleOption2Change} required/>
          <br/>
          <label>Option 3 :</label>
          <input type="text" value={this.state.Option3} onChange={this.handleOption3Change} required/>
          <br/>
          <label>Option 4 :</label>
          <input type="text" value={this.state.Option4} onChange={this.handleOption4Change} required/>
         </div>
        }
        {(this.state.formData.genreName!="Select Genre" && this.state.formData.genreName!="") && this.state.QuizNo!="" && this.state.QuestionType=="single" &&
        <div className="form-group">
          <label>Answer :</label>
          <br/>
          <label>Option 1 :</label>
          <input type="radio" name="singleans" value="1" defaultChecked onChange={this.handleAnswerChange}/>
          <br/>
          <label>Option 2 :</label>
          <input type="radio" name="singleans" value="2" onChange={this.handleAnswerChange}/>
          <br/>
          <label>Option 3 :</label>
          <input type="radio" name="singleans" value="3" onChange={this.handleAnswerChange}/>
          <br/>
          <label>Option 4 :</label>
          <input type="radio" name="singleans" value="4" onChange={this.handleAnswerChange}/>
         </div>
        }
        {(this.state.formData.genreName!="Select Genre" && this.state.formData.genreName!="") && this.state.QuizNo!="" && this.state.QuestionType=="multiple" &&
        <div className="form-group">
          <label>Answer :</label>
          <br/>
          <label>Option 1 :</label>
          <input type="checkbox" onChange={this.handleAnswer1Change}/>
          <br/>
          <label>Option 2 :</label>
          <input type="checkbox" onChange={this.handleAnswer2Change}/>
          <br/>
          <label>Option 3 :</label>
          <input type="checkbox" onChange={this.handleAnswer3Change}/>
          <br/>
          <label>Option 4 :</label>
          <input type="checkbox" onChange={this.handleAnswer4Change}/>
         </div>
        }
            
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

export default AddQuestion;
