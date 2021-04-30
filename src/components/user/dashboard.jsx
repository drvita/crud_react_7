import React, { Component } from "react";
import FormNew from "./add";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      users: [],
      form: false,
      token: props.token,
      user: {},
    };
  }
  componentDidMount() {
    this.getUsers();
  }

  componentDidUpdate(props, state) {
    if (state.form !== this.state.form) {
      console.log("[Dashboard] UPDATE!!!");
      this.getUsers();
    }
  }

  render() {
    const { load, users, form, user, token } = this.state;
    return (
      <div className="row mt-4">
        <div className="col">
          <h4 className="card-title">
            <i className="fas fa-users mr-2"></i>
            <span className="mr-4">Sistema de usuarios</span>
            <span className="badge badge-secondary" onClick={this.closeSesion}>
              [Cerrar sesion]
            </span>
          </h4>
          <div className="card">
            <div className="card-header">
              <h5>
                <i className="fas fa-table mr-2"></i>{" "}
                <span className="mr-4">Tabla de usuarios</span>
                {load ? <small>Cargando...</small> : null}
              </h5>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-sm ">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo electronico</th>
                    <th>Password</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    return (
                      <tr key={user.id}>
                        <td>
                          <i className="fas fa-user mr-2"></i> {user.name}
                        </td>
                        <td>{user.email}</td>
                        <td>************</td>
                        <td>
                          <i
                            className="fas fa-trash mr-2"
                            onClick={(e) => this.deleteUser(user.id, user.name)}
                          ></i>
                          <i
                            className="fas fa-pencil-alt mr-2"
                            onClick={(e) => this.editUser(user)}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {form ? null : (
              <div className="card-footer text-right">
                <button
                  type="submit"
                  className={load ? "btn btn-dark disabled" : "btn btn-dark"}
                  onClick={this.setUser}
                >
                  <i className="fas fa-user mr-2"></i> Nuevo usuario
                </button>
              </div>
            )}
          </div>
        </div>
        {form ? (
          <div className="col-sm-12 col-lg-4 col-md-12 mt-1">
            <FormNew token={token} relod={this.reloadForm} user={user} />
          </div>
        ) : null}
      </div>
    );
  }

  closeSesion = () => {
    if (window.confirm("Esta seguro de cerrar la sesion?")) {
      this.props.logreturn(false, "");
    }
  };
  editUser = (user) => {
    this.setState({
      form: true,
      user,
    });
  };
  deleteUser = (id, name) => {
    const { token } = this.state;
    console.log("[Dashboard] Eliminando usuario:", id);

    if (window.confirm("Esta seguro de eliminar al usuario: '" + name + "'")) {
      this.setState({
        load: true,
      });
      fetch("http://localhost:3001/api/user/" + id, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then(async (response) => {
          let back = {};
          if (response.status !== 204) back = await response.json();
          if (!response.ok) {
            throw new Error(back.message);
          }
          return back;
        })
        .then((response) => {
          console.log(
            "[Dashboard] Usuario eliminado",
            response,
            this.state.load
          );
          this.getUsers();
        })
        .catch((message) => {
          console.error(
            "[Dashboard] Error de conexion con el servidor\n",
            message
          );
          this.setState({
            load: false,
          });
        });
    }
  };
  reloadForm = () => {
    this.setState({
      form: false,
      load: false,
      user: {},
    });
  };
  setUser = () => {
    this.setState({
      form: !this.state.form,
    });
  };
  getUsers = () => {
    const { token } = this.state;
    console.log("[Dashboard] Descargando usuarios");
    this.setState({
      load: true,
    });

    fetch("http://localhost:3001/api/user", {
      method: "GET",
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
          console.log("[Dashboard] Usuarios descargandos", response.data);
          this.setState({
            load: false,
            users: response.data,
          });
        } else {
          this.setState({
            load: false,
          });
        }
      })
      .catch((message) => {
        console.error(
          "[Dashboard] Error de conexion con el servidor\n",
          message
        );
        this.setState({
          load: false,
        });
      });
  };
}
