import React, { useState, useEffect, useContext } from 'react';
import { getAllGroup } from '../../Api/groupApi.js';
import { AuthContext } from '../../context/AuthContext.js';
import { Alert } from "../../helper/notification.js";
import { getAllUsers } from '../../Api/userApi';
import { registerGroupMember } from '../../Api/groupMemberApi';

export default function Settings() {
    const { user } = useContext(AuthContext);
    const [groupData, setGroupData] = useState(null);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({ groupId: "", userid: "", memberRole: "mentor" });
    const [submitting, setSubmitting] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [projects, setProjects] = useState([]);
    const [userData, setUserData] = useState(null);
    const [allMentor, setAllMentor] = useState([]);
    useEffect(() => {
        if (user) {
            fetchGroup();
            fetchUsers();
        }
    }, [user]);

    const fetchGroup = async () => {
        try {
            const data = await getAllGroup();
            setGroupData(data);
        } catch (error) {
            console.error("Error fetching group:", error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const assignMentor = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await registerGroupMember(formData);
            setStatus(response.statusCode);
            setSubmitting(false);
            setFormData({ groupId: "", userid: "", memberRole: "mentor" }); // Reset the form data
            // Optionally, you can fetch courses again to update the list
        } catch (error) {
            console.error("Error registering user:", error.message);
            setStatus(error || "Error");
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (status) {
            let type = "success";
            let message = "";
            switch (status) {
                case 400:
                    type = "error";
                    message = "Invalid user id";
                    break;
                case 409:
                    type = "error";
                    message = "The mentor already assign to this group. Please choose a different group or different mentor. ";
                    break;
                case 200:
                    type = "success";
                    message = "Great work! The operation has been completed successfully.";
                    break;
                case 201:
                    type = "success";
                    message = "Great work! The operation has been completed successfully.";
                    break;
                default:
                    type = "error";
                    message = "An unexpected error occurred. Please try again later.";
            }
            setAlertType(type);
            setMessage(message);
        } else {
            setMessage("");
        }
    }, [status]);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUserData(data);
            setStatus(null);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            setStatus(error || "Error");
        }
    };
    useEffect(() => {
        if (userData && Array.isArray(userData.data)) {
            const students = userData.data.filter(user => user.userRole === "teacher");
            setAllMentor(students);
        }
    }, [userData]);
    return (
        <>
            {message && <Alert type={alertType} message={message} />}
            <div className="flex justify-center py-10 mb-10">
                <div className="w-full xl:w-10/12 max-w-2xl">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
                        <div className="block w-full overflow-x-auto">
                            <section className="max-w-4xl p-6 mx-auto  dark:bg-gray-800">
                                <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">Search Submission By Group</h2>
                                <form>
                                    <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="groupDropdown">Group</label>
                                            <select
                                                name="groupId"
                                                id="groupId"
                                                value={formData.groupId}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                            >
                                                <option value="" disabled>
                                                    Select Group
                                                </option>
                                                {groupData && groupData.data.map((group) => (
                                                    // Check if the group was created by the current user
                                                    <option key={group._id} value={group._id}>
                                                        {group.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="groupDropdown">Mentor</label>
                                            <select
                                                name="userId"
                                                id="userId"
                                                value={formData.userId}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                            >
                                                <option value="" disabled>
                                                    Mentor
                                                </option>
                                                {allMentor.map((student) => (
                                                    <option key={student._id} value={student._id}>
                                                        {`${student.fullName}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button onClick={assignMentor} className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Assign</button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

