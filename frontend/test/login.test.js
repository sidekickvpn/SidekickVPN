import { describe } from 'riteway';
import React from 'react';
import render from 'riteway/render-component';
import Login from '../src/components/Auth/Login';

describe('Login Component', async assert => {
  const createLogin = () => render(<Login />);

  {
    const LoginComponent = createLogin();
    assert({
      given: 'the login componet',
      should: 'render the login form',
      actual: LoginComponent('label')
        .map((i, ele) =>
          LoginComponent(ele)
            .text()
            .trim()
            .toLowerCase()
        )
        .get(),
      expected: ['email', 'password']
    });
  }

  {
    const LoginComponent = createLogin();
    LoginComponent('input#email').val('john@gmail.com');

    assert({
      given: 'an email address',
      should: 'Update the email input/state with the email address',
      actual: LoginComponent('input#email').val(),
      expected: 'john@gmail.com'
    });

    LoginComponent('input#email').val('bob@gmail.com');

    assert({
      given: 'an email address',
      should: 'Update the email input/state with the email address',
      actual: LoginComponent('input#email').val(),
      expected: 'bob@gmail.com'
    });
  }

  {
    const LoginComponent = createLogin();
    LoginComponent('input#password').val('123456');

    assert({
      given: 'a password',
      should: 'Update the password input/state with the password',
      actual: LoginComponent('input#password').val(),
      expected: '123456'
    });

    LoginComponent('input#password').val('654321');

    assert({
      given: 'a password',
      should: 'Update the password input/state with the password',
      actual: LoginComponent('input#password').val(),
      expected: '654321'
    });
  }
});
