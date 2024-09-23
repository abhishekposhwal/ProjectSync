// auth.js

import axios from 'axios';

export const loginUser = async (formData) => {
    try {
        const response = await axios.post('http://localhost:3000/api/v1/users/login', formData);
        return response.data; // Assuming your response includes user data and tokens
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
