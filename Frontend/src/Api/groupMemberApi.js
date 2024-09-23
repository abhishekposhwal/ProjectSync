// profileApi.js
import axios from '../Api/axios.js';

// Register user
export const registerGroupMember = async (userData) => {
    console.log(userData);
    try {
        const response = await axios.post('/v1/users/register-group-member', userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error registering group member';
    }
};

// Get user profile
export const getAllGroupMembers = async () => {
    try {
        const response = await axios.get('/v1/admin/all-group-members', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching Group Members';
    }
};
export const getAllGroupMember = async () => {
    try {
        const response = await axios.get('/v1/users/get-group-members', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching Group Members';
    }
};

// Get user profile
export const getGroupMembers = async (courseId) => {
    try {
        const response = await axios.get(`/v1/admin/group-members/${courseId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching Group Members';
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
