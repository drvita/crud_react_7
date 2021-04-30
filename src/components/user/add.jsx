import React, { Component } from "react";

export default class Add extends Component {
  constructor(props) {
    super(props);
    const { name, email, id } = props.user;
    this.state = {
      id: id ? id : 0,
      name: name ? name : "",
      email: email ? email : "",
      password: "",
      load: false,
      token: props.token,
    };
  }

  componentDidUpdate(props, state) {
    if (this.props.user.id && props.user.id !== this.props.user.id) {
      const { name, email, id } = this.props.user;
      console.log("[Add user] UPDATE!!!");
      this.setState({
        id,
        name,
        email,
      });
    }
  }

  render() {
    const { id, name, email, password, load } = this.state;
    return (
      <div className="card bg-secondary text-white">
        <div className="card-header">
          <h5>
            <i className="fas fa-user mr-2"></i>{" "}
            {id ? "Actualizar usuario" : "Registro de nuevo usuario"}
          </h5>
        </div>
        <div className="card-body">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={name}
              onChange={this.changeform}
            />
          </div>
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
            onClick={this.cancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={load ? "btn btn-dark disabled" : "btn btn-primary"}
            onClick={this.setUser}
          >
            {id ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    );
  }

  cancel = () => {
    this.props.relod();
  };
  changeform = (e) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  };
  setUser = () => {
    const { token, id } = this.state,
      url = id
        ? "http://localhost:3001/api/user/" + id
        : "http://localhost:3001/api/user";
    let body = {
      email: this.state.email,
      name: this.state.name,
    };

    if (this.state.password.length) body["password"] = this.state.password;

    console.log("[Form add user] Enviando datos de usuario: ", body.email);
    this.setState({
      load: true,
    });

    fetch(url, {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
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
          console.log("[Form add user] Usuario almacenado con exito");
          this.props.relod();
        } else {
          this.setState({
            load: false,
          });
        }
      })
      .catch((message) => {
        console.error(
          "[Form add user] Error de conexion con el servidor\n",
          message
        );
        this.setState({
          load: false,
        });
      });
  };
}
