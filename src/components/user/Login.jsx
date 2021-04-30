import React, { Component } from "react";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      load: false,
    };
  }

  render() {
    const { email, password, load } = this.state;
    return (
      <div className="row justify-content-md-center mt-4">
        <div className="col-sm-12 col-lg-6 col-md-8">
          <h4 className="card-title">Sistema de usuarios</h4>
          <div className="card">
            <div className="card-header">
              <h5>Inicio de session</h5>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label>Correo electronico</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={email}
                  onChange={this.changeform}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={this.changeform}
                />
              </div>
            </div>
            <div className="card-footer text-right">
              <button
                type="submit"
                className={load ? "btn btn-dark disabled" : "btn btn-dark"}
                onClick={this.getToken}
              >
                Iniciar session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  changeform = (e) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  };
  getToken = () => {
    const body = {
      email: this.state.email,
      password: this.state.password,
    };
    console.log("INICIANDO LOGIN", body.email);
    this.setState({
      load: true,
    });

    fetch("http://localhost:3001/api/user/login", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res);
        }
        return res.json();
      })
      .then((response) => {
        if (response.data) {
          console.log("[Login] Credenciales validadas", response);
          this.props.logreturn(true, response.data.token);
        } else {
          this.setState({
            load: false,
          });
        }
      })
      .catch((message) => {
        console.error("[Login] Error de conexion con el servidor\n", message);
        this.setState({
          load: false,
        });
      });
  };
}
