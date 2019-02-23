import React, { Component } from 'react';
// import { auth, githubAuthProvider, googleAuthProvider } from '../../firebase';
import { connect } from 'react-redux';
import { loginUser, UserLogin } from '../../actions/auth';
import { Redirect } from 'react-router';
import AuthContext, { AuthContextState } from '../../context/AuthContext';

class Login extends Component<{}> {
  // context: AuthContextState
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

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
    await this.context.loginUser({ email, password });
  };

  render() {
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = (state: any) => ({
//   isAuthenticated: state.auth.isAuthenticated
// });

// export default connect(
//   mapStateToProps,
//   { loginUser }
// )(Login);

export default Login;
