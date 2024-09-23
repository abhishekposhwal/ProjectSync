// profileApi.js
import axios from '../Api/axios.js';

// Register user
export const registerUserRole = async (userRoleData) => {
    try {
        const response = await axios.post('/v1/admin/user-role', userRoleData, {
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
export const getAlluserRole = async () => {
    try {
        const response = await axios.get('/v1/admin/fetched-user-roles', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching projects category';
    }
};

// Update user profile
export const updateUserRole = async (userRoleIde, updatedData) => {
    try {
        const response = await axios.patch(`/v1/admin/update-user-role/${userRoleIde}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error updating user profile';
    }
};


export const deleteUserRole = async (userRoleId) => {
    try {
        const response = await axios.delete(`/v1/admin/delete-user-role/${userRoleId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error deleting project category';
    }
};
