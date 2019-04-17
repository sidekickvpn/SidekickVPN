import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router';
import useFormInput from '../../effects/useFormInput';
import AuthStateContext from '../../contexts/AuthStateContext';
import AuthContext from '../../contexts/AuthContext';
import FormInputGroup from '../common/FormInputGroup';
import { loginUser } from '../../reducers/authReducer';

const Login = () => {
	const email = useFormInput('');
	const password = useFormInput('');
	const auth = useContext(AuthStateContext);
	const dispatch = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	async function handleSubmit(e) {
		e.preventDefault();

		const errors = await loginUser(dispatch, {
			email: email.value,
			password: password.value
		});

		if (errors) {
			setErrors(errors);
		}
	}

	if (auth.isAuthenticated) {
		return <Redirect to="/devices" />;
	}
	return (
		<div className="row">
			<div className="col-md-6 offset-md-3">
				<div className="card">
					<div className="card-body">
						<h3 className="card-title text-center">Login</h3>
						<form onSubmit={handleSubmit}>
							<FormInputGroup
								name="email"
								value={email.value}
								error={errors.email}
								label="Email"
								type="email"
								onChange={email.onChange}
							/>
							<FormInputGroup
								name="password"
								value={password.value}
								error={errors.password}
								label="Password"
								type="password"
								onChange={password.onChange}
							/>
							<button className="btn btn-block btn-primary">Login</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
