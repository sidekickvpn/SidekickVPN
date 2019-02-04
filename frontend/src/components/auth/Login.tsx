import React, { Component } from 'react';
import { auth, githubAuthProvider } from '../../firebase';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { AuthActions } from '../../actions';
import { Dispatch } from 'redux';
import { Redirect } from 'react-router';

interface LoginProps {
  login: (username: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
}

class Login extends Component<LoginProps, any> {
  state = {
    email: '',
    password: ''
  };

  onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await this.props.login(this.state.email, this.state.password);
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }
    const { email, password } = this.state;
    return (
      <div>
        <div className="row">
          <div className="col m6 offset-m3" style={{ marginTop: '2rem' }}>
            <div className="card">
              <div className="card-content">
                <h3 className="center">Login</h3>
                <div className="row">
                  <form className="col s12" onSubmit={this.onSubmit}>
                    <div className="row">
                      <div className="input-field col s12">
                        <input
                          id="email"
                          name="email"
                          type="email"
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
                          name="password"
                          type="password"
                          className="validate"
                          onChange={this.onChange}
                          value={password}
                        />
                        <label htmlFor="password">Password</label>
                      </div>
                    </div>
                    <button className="waves-effect waves-light btn col s12 blue darken-2">
                      Login
                    </button>
                  </form>
                </div>
                <div className="row">
                  <hr className="col s4 offset-s1" />
                  <span className="col">OR</span>
                  <hr className="col s4" />
                </div>
                <div className="row">
                  <button
                    className="waves-effect btn black col s12"
                    onClick={() => auth.signInWithPopup(githubAuthProvider)}
                  >
                    GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { login }
)(Login);
