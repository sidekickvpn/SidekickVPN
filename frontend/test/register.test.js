import { describe } from 'riteway';
import React from 'react';
import render from 'riteway/render-component';
import Register from '../src/components/Auth/Register';

describe('Register Component', async assert => {
	const createRegister = () => render(<Register />);

	{
		const RegisterComponent = createRegister();
		assert({
			given: 'the register componet',
			should: 'render the registeration form',
			actual: RegisterComponent('label')
				.map((i, ele) =>
					RegisterComponent(ele)
						.text()
						.trim()
						.toLowerCase()
				)
				.get(),
			expected: [
				'firstname',
				'lastname',
				'email',
				'password',
				'confirm password'
			]
		});
	}

	{
		const RegisterComponent = createRegister();
		RegisterComponent('input#email').val('john@gmail.com');

		assert({
			given: 'an email address',
			should: 'Update the email input/state with the email address',
			actual: RegisterComponent('input#email').val(),
			expected: 'john@gmail.com'
		});

		RegisterComponent('input#email').val('bob@gmail.com');

		assert({
			given: 'an email address',
			should: 'Update the email input/state with the email address',
			actual: RegisterComponent('input#email').val(),
			expected: 'bob@gmail.com'
		});
	}

	{
		const RegisterComponent = createRegister();
		RegisterComponent('input#password').val('123456');

		assert({
			given: 'a password',
			should: 'Update the password input/state with the password',
			actual: RegisterComponent('input#password').val(),
			expected: '123456'
		});

		RegisterComponent('input#password').val('654321');

		assert({
			given: 'a password',
			should: 'Update the password input/state with the password',
			actual: RegisterComponent('input#password').val(),
			expected: '654321'
		});
	}
});
