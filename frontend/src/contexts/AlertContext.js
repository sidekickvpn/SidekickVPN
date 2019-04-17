import React from 'react';

const AlertContext = React.createContext({
	name: '',
	message: '',
	count: 0
});

export default AlertContext;
