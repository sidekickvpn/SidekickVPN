import React, { useState } from 'react';
import axios from 'axios';
import useFormInput from '../../effects/useFormInput';
import FormInputGroup from '../common/FormInputGroup';

const Register = props => {
	const firstname = useFormInput('');
	const lastname = useFormInput('');
	const email = useFormInput('');
	const password = useFormInput('');
	const password2 = useFormInput('');

	const [errors, setErrors] = useState({});

	const handleSubmit = e => {
		e.preventDefault(e);

		if (password.value !== password2.value) {
			setErrors({
				passwordMismatch: 'Passwords do not match'
			});
		} else {
			axios
				.post('/api/users/register', {
					firstname: firstname.value,
					lastname: lastname.value,
					email: email.value,
					password: password.value
				})
				.then(res => props.history.push('/login'))
				.catch(err => setErrors(err.response.data));
		}
	};

	return (
		<div className="row">
			<div className="card col-md-8 offset-md-2">
				<div className="card-body">
					<h3 className="card-title text-center">Register</h3>
					<form onSubmit={handleSubmit} className="needs-validation">
						<div className="row">
							<div className="col-md-6">
								<FormInputGroup
									name="firstname"
									value={firstname.value}
									error={errors.firstname}
									label="Firstname"
									onChange={firstname.onChange}
								/>
							</div>
							<div className="col-md-6">
								<FormInputGroup
									name="lastname"
									value={lastname.value}
									error={errors.lastname}
									label="Lastname"
									onChange={lastname.onChange}
								/>
							</div>
						</div>
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
						<FormInputGroup
							name="password2"
							value={password2.value}
							error={errors.passwordMismatch}
							label="Confirm Password"
							type="password"
							onChange={password2.onChange}
						/>
						<button className="btn btn-block btn-primary">Register</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
