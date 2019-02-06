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
      <div className="row">
        <div className="card col-md-8 offset-md-2">
          <div className="card-body">
            <h3 className="card-title text-center">Register</h3>
            <form onSubmit={this.onSubmit}>
              <div className="row">
                <div className="form-group col-md-6">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    className="form-control"
                    onChange={this.onChange}
                    value={firstName}
                  />
                </div>
                <div className="form-group col s6">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    className="form-control"
                    onChange={this.onChange}
                    value={lastName}
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
