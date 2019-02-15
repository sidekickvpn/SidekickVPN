import React, { Component } from 'react';
// import { auth, githubAuthProvider, googleAuthProvider } from '../../firebase';
import { connect } from 'react-redux';
import { loginUser, UserLogin } from '../../actions/auth';
import { Redirect } from 'react-router';

interface LoginProps {
  loginUser: (userData: UserLogin) => void;
  isAuthenticated: boolean;
}

class Login extends Component<LoginProps> {
  state = {
    email: '',
    password: ''
  };

  onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = this.state;
    await this.props.loginUser({ email, password });
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }
    const { email, password } = this.state;
    return (
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Login</h3>
              <form onSubmit={this.onSubmit}>
                <div className="row">
                  <div className="form-group col-sm-12">
                    <label>Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      onChange={this.onChange}
                      value={email}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-sm-12">
                    <label>Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-control"
                      onChange={this.onChange}
                      value={password}
                    />
                  </div>
                </div>
                <button className="btn btn-block btn-primary">Login</button>
              </form>
              {/* <div className="card-body">
                <p className="text-center lead">Sign in With</p>
                <button
                  className="btn btn-block btn-danger mb-2"
                  onClick={() => auth.signInWithPopup(googleAuthProvider)}
                >
                  <i className="fab fa-google mr-2" />
                  Google
                </button>
                <button className="btn btn-block btn-primary mb-2">
                  <i className="fab fa-facebook mr-2" />
                  Facebook
                </button>
                <button className="btn btn-block btn-info mb-2">
                  <i className="fab fa-twitter mr-2" />
                  Twitter
                </button>
                <button
                  className="btn btn-block btn-dark"
                  onClick={() => auth.signInWithPopup(githubAuthProvider)}
                >
                  <i className="fab fa-github mr-2" />
                  GitHub
                </button>
              </div> */}
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
  { loginUser }
)(Login);
