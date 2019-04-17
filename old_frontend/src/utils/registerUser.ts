import axios from 'axios';
import { UserRegister } from '../context/AuthContext';

// Register User
const registerUser = (userData: UserRegister, history: any) => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err => console.log(err));
};

export default registerUser;
