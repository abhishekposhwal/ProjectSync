import React, { useState, useEffect, useContext } from 'react';
import { getAllGroup } from '../../Api/groupApi.js';
import { AuthContext } from '../../context/AuthContext.js';
import { Alert } from "../../helper/notification.js";
import { getProjectsByGroup } from '../../Api/projectApi.js'; // Assume this function fetches projects by group ID

export default function Settings() {
    const { user } = useContext(AuthContext);
    const [groupData, setGroupData] = useState(null);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({ groupId: "" });
    const [submitting, setSubmitting] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (user) {
            fetchGroup();
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

    const fetchProjectsByGroup = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const data = await getProjectsByGroup(formData.groupId);
            if (data.statusCode === 200) {
                setProjects(data.data); // Set projects array if response is successful
            } else {
                // Handle error cases here
                console.error("Error fetching projects:", data.message);
            }
            setStatus(data.statusCode);
            setSubmitting(false);
        } catch (error) {
            console.error("Error fetching projects:", error.message);
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
                    message = "The group name cannot be empty. Please provide a valid group name.";
                    break;
                case 409:
                    type = "error";
                    message = "The group name already exists. Please choose a different name.";
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
                                                {groupData && groupData.data.map((group) => {
                                                    // Check if the group was created by the current user
                                                    if (group.createdBy === user._id) {
                                                        return (
                                                            <option key={group._id} value={group._id}>
                                                                {group.name}
                                                            </option>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button onClick={fetchProjectsByGroup} className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Search</button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

            {projects && projects.length > 0 && (
                <div className="flex justify-center">
                    <div className="w-full xl:w-10/12 max-w-2xl">
                        {projects.map((project) => (
                            <div key={project._id} className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
                                <div className="max-w-2xl overflow-hidden dark:bg-gray-800 m-4">

                                    <div className="p-6">
                                        <div class="flex items-center justify-between">
                                            <span class="text-sm font-light text-gray-600 dark:text-gray-400">Submiited At - {new Date(project.createdAt).toLocaleDateString()}</span>

                                            {project.submission.mentorApproval === 'pending' ? (
                                                <span className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-yellow-500 rounded cursor-pointer hover:bg-gray-500">Pending</span>
                                            ) : project.submission.mentorApproval === 'approved' ? (
                                                <span className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-green-600 rounded cursor-pointer hover:bg-gray-500">Approved</span>
                                            ) : (
                                                <span className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-red-600 rounded cursor-pointer hover:bg-gray-500">Rejected</span>
                                            )}

                                        </div>
                                        <div>
                                            <span className="text-xs font-medium text-blue-600 uppercase dark:text-blue-400">{project.groupName}</span>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                <b className=" mt-2 text-lg  text-gray-800"> Title -</b> {project.title}
                                            </p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><b>Introduction</b> - {project.introduction}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><b>Category</b> - {project.category}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><b>Problem Statement</b> - {project.problemStatement}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><b>Required Technology</b> - {project.requiredTechnology}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><b>Software Requirement</b> - {project.softwareRequirement}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><b>Hardware Requirement</b> - {project.hardwareRequirement}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><b>Conclusion</b> - {project.conclusion}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400"><b>References</b> - {project.references}</p>
                                            {/* <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Submission Status - {project.submission.status}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Mentor Approval - {project.submission.mentorApproval}</p> */}
                                        </div>
                                        {/* <div className="mt-4">
                                            <div className="flex items-center">
                                                <img className="object-cover h-10 rounded-full" src="https://via.placeholder.com/150" alt="Avatar" />
                                                <p className="mx-2 font-semibold text-gray-700 dark:text-gray-200">{project.mentorName}</p>
                                               
                                                <span className="mx-1 text-xs text-gray-600 dark:text-gray-300 mt-1"></span>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


        </>
    );
}

