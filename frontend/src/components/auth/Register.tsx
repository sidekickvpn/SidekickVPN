import React, { Component } from 'react';
import { auth } from '../../firebase';

class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: ''
  };

  onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password, password2 } = this.state;

    if (password !== password2) {
      console.log('Passwords do not match');
    } else {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          console.log(user);
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    const { firstName, lastName, email, password, password2 } = this.state;
    return (
      <div className="card">
        <div className="card-content">
          <h3 className="center">Register</h3>
          <div className="row">
            <form className="col s12" onSubmit={this.onSubmit}>
              <div className="row">
                <div className="input-field col s6">
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    className="validate"
                    onChange={this.onChange}
                    value={firstName}
                  />
                  <label htmlFor="firstName">First Name</label>
                </div>
                <div className="input-field col s6">
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    className="validate"
                    onChange={this.onChange}
                    value={lastName}
                  />
                  <label htmlFor="lastName">Last Name</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="validate"
                    onChange={this.onChange}
                    value={email}
                  />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="validate"
                    onChange={this.onChange}
                    value={password}
                  />
                  <label htmlFor="password">Password</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="password2"
                    type="password"
                    name="password2"
                    className="validate"
                    onChange={this.onChange}
                    value={password2}
                  />
                  <label htmlFor="password2">Confirm Password</label>
                </div>
              </div>
              <button className="waves-effect waves-light btn col s12 blue darken-2">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
