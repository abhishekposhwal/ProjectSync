// profileApi.js
import axios from '../Api/axios.js';

// Register user
export const registerProject = async (userData) => {
    console.log(userData);
    try {
        const response = await axios.post('/v1/users/register-project-details', userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error registering user';
    }
};

// Get user profile
export const getProjectDetails = async () => {
    try {
        const response = await axios.get('/v1/admin/all-projects', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching projects';
    }
};

export const getProjectsByGroup = async (groupId) => {
    try {
        const response = await axios.get(`/v1/users/project/${groupId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching projects';
    }
};

