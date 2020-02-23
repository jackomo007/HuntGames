import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FaStarHalf } from 'react-icons/fa';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaSpaceShuttle } from 'react-icons/fa';

const guide_const = 0;

class App extends Component {
  state = {
    response: {},
    next: '',
    guide: 0
  };

  nextPage(link) {
    this.sendURL(link)
      .then(resp => {
        this.setState({ response: {}, next: '' });
        this.setState({ response: resp.results, next: resp.next })

      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.callApi()
      .then(res => {
        this.setState({ response: res.results, next: res.next, guide: guide_const })
      })
      .catch(err => console.log(err));
  }

  sendURL = async (link) => {
    const response = await fetch('/api/games/next?url=' + link);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    let next_guide = this.state.guide + 1;
    this.setState({ guide: next_guide });
    return body.games[next_guide];
  }

  callApi = async () => {
    const response = await fetch('/api/games');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body.games[0];
  };

  render() {
    const content = Object.keys(this.state.response).map((key) => {
      return (
        <div key={this.state.response[key].id}>
          <img src={this.state.response[key].background_image} className="App-game" alt="logo" />
          <h1 className="App-title">Title: {this.state.response[key].name}</h1>
          <h3 className="App-title">Released: {this.state.response[key].released} <FaRegCalendarAlt /></h3>
          <h3 className="App-title">Rating: {this.state.response[key].rating} <FaStarHalf /></h3>
        </div>
      )
    });

    const next = this.state.next;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" onClick={() => this.nextPage(next)} />
          <div>{content}</div>
          <FaSpaceShuttle onClick={(e) => this.nextPage(next)} className="App-icon" />
        </header>
      </div>
    );
  }
}

export default App;