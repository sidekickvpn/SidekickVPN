import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const FormInputGroup = ({
	name,
	placeholder,
	value,
	error,
	label,
	info,
	type,
	onChange,
	disabled
}) => {
	return (
		<div className="form-group">
			<label htmlFor={name}>{label}</label>
			<input
				type={type}
				className={classnames('form-control', {
					'is-invalid': error
				})}
				placeholder={placeholder}
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
			/>
			{info && <div className="text-muted">{info}</div>}
			{error && <div className="invalid-feedback">{error}</div>}
		</div>
	);
};

FormInputGroup.propTypes = {
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	label: PropTypes.string,
	info: PropTypes.any,
	error: PropTypes.string,
	type: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	disabled: PropTypes.string
};

FormInputGroup.defaultProps = {
	type: 'text'
};

export default FormInputGroup;
