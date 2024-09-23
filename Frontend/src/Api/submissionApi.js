import axios from '../Api/axios.js';

export const updateSubmissionStatus = async (submissionId, mentorApproval) => {
    try {
        const response = await axios.patch(
            `/v1/users/update-submission/${submissionId}`,
            { mentorApproval }, // Pass the mentorApproval as an object property
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error updating status';
    }
};
