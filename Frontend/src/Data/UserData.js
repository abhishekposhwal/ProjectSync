// auth.js

import axios from 'axios';

export const getCurrentUser = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/users/current-user', {},);
        return response.data; // Assuming your response includes user data and tokens
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
