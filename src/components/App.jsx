import React, { Component } from "react";
import LoginForm from "./user/Login";
import Dashboard from "./user/dashboard";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      login: false,
      token: "",
    };
  }

  render() {
    const { login, token } = this.state;
    return (
      <div className="container">
        {login ? (
          <Dashboard
            login={this.logReturnChange}
            token={token}
            logreturn={this.logReturnChange}
          />
        ) : (
          <LoginForm logreturn={this.logReturnChange} />
        )}
      </div>
    );
  }

  logReturnChange = (val, token) => {
    this.setState({
      login: Boolean(val),
      token,
    });
  };
}
