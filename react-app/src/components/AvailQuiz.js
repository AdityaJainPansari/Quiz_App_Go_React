import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import './NewPerson.css';

class AvailQuiz extends Component {
  constructor() {
    super();
    this.state = {
      formData: {
        genreName: "",
        QuizNo: "1",
        QuestionType: "single",
        User: "",
        Score: 0,
      },
      Answer1: [],
      Answer2: [],
      Answer3: [],
      Answer4: [],
      submitted: false,
      message: "",
      genres: [],
      questions: [],
      maxQuizNo: 1,
      QuizNo : "1",
      QuestionType : "single",
      hintTaken : false
    }
    this.handleGChange = this.handleGChange.bind(this);
    this.handleQNChange = this.handleQNChange.bind(this);
    this.handleQTChange = this.handleQTChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleAnswer1Change = this.handleAnswer1Change.bind(this);
    this.handleAnswer2Change = this.handleAnswer2Change.bind(this);
    this.handleAnswer3Change = this.handleAnswer3Change.bind(this);
    this.handleAnswer4Change = this.handleAnswer4Change.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    this.state.formData.User=JSON.parse(localStorage["auth"]).username
    //alert(this.state.formData.User)
    var i  
    var score=0;
    for(i=0;i<this.state.questions.length;i++)
    {
        if(this.state.QuestionType=="single")
        {
            var radioval= document.getElementsByName(i);
            var ansforme= document.getElementsByName("answer");
            var hint= document.getElementsByName("hint");
            var answer=parseInt(this.state.questions[i].Answer)
            if(ansforme[i].checked==true)
                score=score+3
            else if(hint[i].checked==true)
                score=score+6
            else if(radioval[answer-1].checked==true)
            {
                score=score+10
            }
        }
        else if(this.state.QuestionType=="multiple")
        {
            var ansforme= document.getElementsByName("answer");
            var hint= document.getElementsByName("hint");
            if(ansforme[i].checked==true)
                score=score+3
            else if(hint[i].checked==true)
                score=score+6
            else if(this.state.Answer1[i]==this.state.questions[i].Answer1)
            if(this.state.Answer2[i]==this.state.questions[i].Answer2)
            if(this.state.Answer3[i]==this.state.questions[i].Answer3)
            if(this.state.Answer4[i]==this.state.questions[i].Answer4)
            score=score+10
        }
    }
    this.state.formData.Score=score
    alert("Your score is : "+score)

    event.preventDefault();
    fetch('http://localhost:8080/addtoboard', {
     method: 'POST',
     body: JSON.stringify(this.state.formData),
   })
      .then(response => {
        if(response.status >= 200 && response.status < 300)
        {
          this.setState({submitted: true});
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
    this.state.formData.QuizNo = 1;

    console.log(this.state.formData.genreName)
    const request = new Request('http://127.0.0.1:8080/questions/'+this.state.formData.genreName+"/"+this.state.formData.QuizNo+"/"+this.state.formData.QuestionType);
    console.log(request)
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({questions: data}));
     console.log(this.state.questions)
     this.state.Answer1.splice(0, this.state.Answer1.length)
     this.state.Answer2.splice(0, this.state.Answer2.length)
     this.state.Answer3.splice(0, this.state.Answer3.length)
     this.state.Answer4.splice(0, this.state.Answer4.length)
     var i
     for(i=0;i<this.state.questions.length;i++)
     {
         this.state.Answer1.push(false)
         this.state.Answer2.push(false)
         this.state.Answer3.push(false)
         this.state.Answer4.push(false)
         // console.log(this.state.questions[i].id)
         // if(this.state.genres[i].genreName==this.state.formData.genreName)
         //     this.setState({maxQuizNo:this.state.genres[i].noOfQuiz})
     }
      this.setState({hintTaken:false})
      this.setState({QuizNo: this.state.formData.QuizNo})
  }
  handleQNChange(event) {
    this.state.formData.QuizNo = parseInt(event.target.value);
    const request = new Request('http://127.0.0.1:8080/questions/'+this.state.formData.genreName+"/"+this.state.formData.QuizNo+"/"+this.state.formData.QuestionType);
    console.log(request)
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({questions: data}));
     console.log(this.state.questions)
     this.state.Answer1.splice(0, this.state.Answer1.length)
     this.state.Answer2.splice(0, this.state.Answer2.length)
     this.state.Answer3.splice(0, this.state.Answer3.length)
     this.state.Answer4.splice(0, this.state.Answer4.length)
     var i
     for(i=0;i<this.state.questions.length;i++)
     {
         this.state.Answer1.push(false)
         this.state.Answer2.push(false)
         this.state.Answer3.push(false)
         this.state.Answer4.push(false)
         // console.log(this.state.questions[i].id)
         // if(this.state.genres[i].genreName==this.state.formData.genreName)
         //     this.setState({maxQuizNo:this.state.genres[i].noOfQuiz})
     }
      this.setState({hintTaken:false})
      this.setState({QuizNo: event.target.value})
  }
  handleQTChange(event) {
    this.state.formData.QuestionType = event.target.value;
    const request = new Request('http://127.0.0.1:8080/questions/'+this.state.formData.genreName+"/"+this.state.formData.QuizNo+"/"+this.state.formData.QuestionType);
    console.log(request)
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({questions: data}));
     console.log(this.state.questions)
     this.state.Answer1.splice(0, this.state.Answer1.length)
     this.state.Answer2.splice(0, this.state.Answer2.length)
     this.state.Answer3.splice(0, this.state.Answer3.length)
     this.state.Answer4.splice(0, this.state.Answer4.length)
    var i
    for(i=0;i<this.state.questions.length;i++)
    {
        this.state.Answer1.push(false)
        this.state.Answer2.push(false)
        this.state.Answer3.push(false)
        this.state.Answer4.push(false)
        // console.log(this.state.questions[i].id)
        // if(this.state.genres[i].genreName==this.state.formData.genreName)
        //     this.setState({maxQuizNo:this.state.genres[i].noOfQuiz})
    }
      this.setState({hintTaken:false})
      this.setState({QuestionType: event.target.value})
    
  }
  handleAnswer1Change(key,event) {
    console.log(key)
    this.state.Answer1[key] = event.target.checked;
    console.log(this.state.Answer1)
  }
  handleAnswer2Change(key,event) {
      console.log(key)
    this.state.Answer2[key] = event.target.checked;
    console.log(this.state.Answer2)
}
  handleAnswer3Change(key,event) {
    console.log(key)
    this.state.Answer3[key] = event.target.checked;
    console.log(this.state.Answer3)
  }
  handleAnswer4Change(key,event) {
    console.log(key)
    this.state.Answer4[key] = event.target.checked;
    console.log(this.state.Answer4)
  }
  handleClick(key,event) {
      if(this.state.QuestionType=="multiple")
          alert(this.state.questions[key].Answer1+","+this.state.questions[key].Answer2+","+this.state.questions[key].Answer3+","+this.state.questions[key].Answer4)
      else
          alert(this.state.questions[key].Answer)
      this.setState({hintTaken:true})
  }

  render() {

    return (
      <div className="App">
      {!JSON.parse(localStorage["auth"]).authenticated && <Redirect to="/Login"/>}
      {this.state.submitted &&
        <div>
            <Redirect to='/Dashboard' />
        </div>
        }
        <header className="App-header">
          <h1 className="App-title">Create a New Question</h1>
        </header>
        <br/><br/>
        <div >
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
            <input type="number" min='1' defaultValue='1' max={this.state.maxQuizNo} value={this.state.QuizNo} onChange={this.handleQNChange}/> &nbsp;  &nbsp; Out of {this.state.maxQuizNo} quiz available for this genre
            <br/>
            <label>Question Type : </label>
            <select onChange={this.handleQTChange}>
              <option value="single">Single Correct</option>
              <option value="multiple">Multiple Correct</option>
            </select>
        </div>

        }
        {this.state.QuestionType=="single" && this.state.questions.map(function(item, key) {
            return (
        <div >
          <h3 ><b>Question {key+1} :</b>
          {item.Question}</h3>
          <br/>
          <br/>
          <input type="radio" id={key} name="answer"/>Answer for me ! (30% points)
          <input type="radio" id={key} name="hint" disabled={this.state.hintTaken} onChange={(e) => this.handleClick(key,e)}/>show hint ! (60% points)
          <br/>
          <br/>
          <h5><label>Option 1 :</label>
          <input type="radio" name={key} value="1" defaultChecked />
          {item.Option1}</h5>
          <br/>
          <br/>
          <h5><label>Option 2 :</label>
          <input type="radio" name={key} value="2"/>
          {item.Option2}</h5>
          <br/>
          <br/>
          <h5><label>Option 3 :</label>
          <input type="radio" name={key} value="3" />
          {item.Option3}</h5>
          <br/>
          <br/>
          <h5><label>Option 4 :</label>
          <input type="radio" name={key} value="4" />
          {item.Option4}</h5>
          <hr noshade size='50'/>
         </div>
        )},this)
        }
        {this.state.QuestionType=="multiple" && this.state.questions.map(function(item, key) {
            return (
        <div className="form-group">
          <h3><b>Question {key+1} :</b>
          {item.Question}</h3>
          <br/>
          <br/>
          <input type="radio" id={key} name="answer"/>Answer for me ! (30% points)
          <input type="radio" id={key} name="hint" disabled={this.state.hintTaken} onChange={(e) => this.handleClick(key,e)}/>show hint ! (60% points)
          <br/>
          <br/>
          <h5><label>Option 1 :</label>
          <input type="checkbox" onChange={(e) => this.handleAnswer1Change(key,e)} />
          {item.Option1}</h5>
          <br/>
          <br/>
          <h5><label>Option 2 :</label>
          <input type="checkbox" onChange={(e) => this.handleAnswer2Change(key,e)} />
          {item.Option2}</h5>
          <br/>
          <br/>
          <h5><label>Option 3 :</label>
          <input type="checkbox" onChange={(e) => this.handleAnswer3Change(key,e)} />
          {item.Option3}</h5>
          <br/>
          <br/>
          <h5><label>Option 4 :</label>
          <input type="checkbox" onChange={(e) => this.handleAnswer4Change(key,e)} />
          {item.Option4}</h5>
          <hr noshade size='50'/>
         </div>
        )},this)
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

export default AvailQuiz;
