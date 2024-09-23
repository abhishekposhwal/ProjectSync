// profileApi.js
import axios from '../Api/axios.js';

// Register user profile
export const registerDepartment = async (departmentData) => {
    console.log(departmentData);
    try {
        const response = await axios.post('/v1/admin/register-department', departmentData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error registering department';
    }
};

let cachedDepartments = null;

export const getAllDepartments = async () => {
    // If departments are already cached, return them immediately
    if (cachedDepartments) {
        return cachedDepartments;
    }

    try {
        const response = await axios.get('/v1/admin/all-departments', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        // Cache the departments data
        cachedDepartments = response.data;
        return cachedDepartments;
    } catch (error) {
        throw error.response?.status || 'Error fetching departments';
    }
};

// Update user profile
export const updateDepartment = async (departmentId, updatedData) => {
    try {
        const response = await axios.patch(`/v1/admin/update-department/${departmentId}`, updatedData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error updating department';
    }
};


export const deleteDepartment = async (departmentId) => {
    try {
        const response = await axios.delete(`/v1//admin/delete-department/${departmentId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error deleting department';
    }
};
