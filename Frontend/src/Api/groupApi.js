// profileApi.js
import axios from '../Api/axios.js';

// Register user
export const registerGroup = async (userData) => {
    console.log(userData);
    try {
        const response = await axios.post('/v1/admin/register-group', userData, {
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
export const getAllGroup = async () => {
    try {
        const response = await axios.get('/v1/admin/all-groups', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching users';
    }
};

// Update user profile
export const updateGroup = async (courseId, updatedData) => {
    try {
        const response = await axios.patch(`/v1/admin/update-course/${courseId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error updating user profile';
    }
};


export const deleteGroup = async (groupId) => {
    try {
        const response = await axios.delete(`/v1/admin/delete-group/${groupId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error deleting group';
    }
};
