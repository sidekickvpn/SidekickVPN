#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');

const { addUser, deleteUser } = require('./mongo');

const questions = [
	{
		type: 'input',
		name: 'firstname',
		message: 'Firstname:',
		validate: val => val.length !== 0
	},
	{
		type: 'input',
		name: 'lastname',
		message: 'Lastname:',
		validate: val => val.length !== 0
	},
	{
		type: 'input',
		name: 'email',
		message: 'Email:',
		validate: val => val.length !== 0
	},
	{
		type: 'password',
		name: 'password',
		message:
			'Password (At least 6 characters, should include letters and numbers):',
		validate: val => val.length >= 6
	},
	{
		type: 'password',
		name: 'password2',
		message: 'Confirm Password:',
		validate: val => val.length >= 6
	}
];

const adminUser = {
	firstname: 'Admin',
	lastname: 'Helper',
	email: 'admin',
	password: process.env.ADMIN_PWD
};

program.version('1.0.0').option('User Setup CLI');

program
	.command('admin')
	.description('Add admin user')
	.action(() => {
		if (!adminUser.password || adminUser.password == 0) {
			console.info('Need to set ADMIN_PWD env variable');
		} else {
			addUser(adminUser);
		}
	});

program
	.command('deleteAdmin')
	.description('Delete admin user')
	.action(() => {
		deleteUser(adminUser.email);
	});

program
	.command('add')
	.option('-i, --interactive', 'Interactive Prompt')
	.option('-f, --firstname [firstname]', 'User Firstname')
	.option('-l, --lastname [lastname]', 'UserLastname')
	.option('-e, --email [email]', 'User Email')
	.option('-p, --password [password]', 'User Password')
	.description('Add user')
	.action(cmd => {
		if (cmd.interactive) {
			prompt(questions).then(answers => {
				const { firstname, lastname, email, password, password2 } = answers;
				if (password !== password2) {
					console.info('Passwords do not match!');
				} else {
					addUser({
						firstname,
						lastname,
						email,
						password
					});
				}
			});
		} else {
			const { firstname, lastname, email, password } = cmd;
			if (!firstname) {
				console.log('Firstname is required');
				return;
			}
			if (!lastname) {
				console.log('Lastname is required');
				return;
			}
			if (!email) {
				console.log('Email is required');
				return;
			}
			if (!password) {
				console.log('Password is required');
				return;
			}

			addUser({
				firstname,
				lastname,
				email,
				password
			});
		}
	});

program.parse(process.argv);
