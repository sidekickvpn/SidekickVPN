import React, { Component } from 'react';

import registerUser from '../../utils/registerUser';
import AuthContext from '../../context/AuthContext';

interface RegisterState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password2: string;
}

class Register extends Component<any, RegisterState> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  state = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password2: ''
  };

  onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as any);
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { firstname, lastname, email, password, password2 } = this.state;

    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      registerUser(
        {
          firstname,
          lastname,
          email,
          password
        },
        this.props.history
      );
    }
  };

  render() {
    const { firstname, lastname, email, password, password2 } = this.state;
    return (
      <div className="row">
        <div className="card col-md-8 offset-md-2">
          <div className="card-body">
            <h3 className="card-title text-center">Register</h3>
            <form onSubmit={this.onSubmit}>
              <div className="row">
                <div className="form-group col-md-6">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    id="firstname"
                    type="text"
                    name="firstname"
                    className="form-control"
                    onChange={this.onChange}
                    value={firstname}
                  />
                </div>
                <div className="form-group col s6">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    id="lastname"
                    type="text"
                    name="lastname"
                    className="form-control"
                    onChange={this.onChange}
                    value={lastname}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  onChange={this.onChange}
                  value={email}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={this.onChange}
                  value={password}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password2">Confirm Password</label>
                <input
                  id="password2"
                  type="password"
                  name="password2"
                  className="form-control"
                  onChange={this.onChange}
                  value={password2}
                />
              </div>
              <button className="btn btn-block btn-primary">Register</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
