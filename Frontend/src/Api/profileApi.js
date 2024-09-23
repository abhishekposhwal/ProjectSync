// profileApi.js
import axios from '../Api/axios.js';

// Register user profile
export const registerUserProfile = async (userData) => {
    try {
        const response = await axios.post('/v1/users/register-user-profile', userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error registering user profile';
    }
};

// Get user profile
export const getUserProfile = async () => {
    try {
        const response = await axios.get('/v1/users/user-profile/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching user profile';
    }
};

// Update user profile
export const updateUserProfile = async (userProfileId, updatedData) => {
    try {
        const response = await axios.patch(`/v1/users/update-user-profile/${userProfileId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Request was made and server responded with a status code that falls out of the range of 2xx
            throw new Error(error.response.data.message || 'Error updating user profile');
        } else if (error.request) {
            // Request was made but no response was received
            throw new Error('No response received from the server');
        } else {
            // Something happened in setting up the request that triggered an error
            throw new Error('Error setting up request to update user profile');
        }
    }
};