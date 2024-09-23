// profileApi.js
import axios from '../Api/axios.js';

// Register user profile
export const registerCourse = async (userData) => {
    console.log(userData);
    try {
        const response = await axios.post('/v1/admin/register-course', userData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error registering course';
    }
};

// Get user profile
export const getAllCourses = async () => {
    try {
        const response = await axios.get('/v1/users/all-courses', {
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
export const updateCourse = async (courseId, updatedData) => {
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


export const deleteCourse = async (courseId) => {
    try {
        const response = await axios.delete(`/v1/admin/delete-course/${courseId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error deleting user profile';
    }
};
