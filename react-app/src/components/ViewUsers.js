import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import './ViewPeople.css';

var toBeDeleted= {}
class ViewUsers extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
    this.handleSubmit=this.handleSubmit.bind(this)
    this.handleToggle=this.handleToggle.bind(this)
  }

  // Lifecycle hook, runs after component has mounted onto the DOM structure
  componentDidMount() {
    const request = new Request('http://127.0.0.1:8080/user/');
    fetch(request)
      .then(response => response.json())
        .then(data => this.setState({data: data}));
    console.log(toBeDeleted)
  }


  handleSubmit(event) {
    var i
    //event.preventDefault();
    for (var id in toBeDeleted)
    {
        if(toBeDeleted[id]==true)
        fetch("http://localhost:8080/delete/"+id, {
             method: 'DELETE',
        })
    }
  }

  handleToggle(id,event) {
    console.log(id)
    toBeDeleted[id] = event.target.checked;
    console.log(toBeDeleted)
  }

  render() {
    return (
      <div className="App">
      {!JSON.parse(localStorage["auth"]).authenticated && <Redirect to="/Login"/>}
      {JSON.parse(localStorage["auth"]).authenticated && !JSON.parse(localStorage["auth"]).admin && <Redirect to="/Dashboard"/>}
        <header className="App-header">
          <h1 className="App-title">View All Users</h1>
        </header>
        
        <form onSubmit={this.handleSubmit}>
        <table className="table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>{this.state.data.map(function(item, key) {
               return (
                  <tr key = {key}>
                      <td><input type="checkbox" onChange={(e) => this.handleToggle(item.id,e)} />
                      &nbsp;&nbsp;{item.id}</td>
                      <td>{item.username}</td>
                      <td>{item.email}</td>
                  </tr>
                )
             },this)}
          </tbody>
       </table>
       <button type="submit" className="btn btn-default">Submit</button>
       </form>
      </div>
    );
  }
}

export default ViewUsers;
