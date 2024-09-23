// profileApi.js
import axios from '../Api/axios.js';

// Register user
export const registerProjectCategory = async (projectCategoryData) => {
    try {
        const response = await axios.post('/v1/admin/register-project-category', projectCategoryData, {
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
export const getAllProjectCategory = async () => {
    try {
        const response = await axios.get('/v1/admin/all-project-categories', {
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
export const updateProjectCategory = async (projectId, updatedData) => {
    try {
        const response = await axios.patch(`/v1/admin/update-project-category/${projectId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error updating user profile';
    }
};


export const deleteProjectCategory = async (projectCategoryId) => {
    try {
        const response = await axios.delete(`/v1/admin/delete-project-category/${projectCategoryId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error deleting project category';
    }
};
