import React, { useState, useEffect, useContext } from 'react';
import { getAllGroup } from '../../Api/groupApi.js';
import { AuthContext } from '../../context/AuthContext.js';
import { Alert } from "../../helper/notification.js";
import { getProjectsByGroup } from '../../Api/projectApi.js'; // Assume this function fetches projects by group ID
import { updateSubmissionStatus } from '../../Api/submissionApi.js'; // Assume this function fetches projects by group ID
import { getGroupMembers, getAllGroupMember } from '../../Api/groupMemberApi';

export default function Settings() {
    const { user } = useContext(AuthContext);
    const [groupData, setGroupData] = useState(null);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({ groupId: "" });
    const [submitting, setSubmitting] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [projects, setProjects] = useState([]);
    const [groupMemberData, setGroupMemberData] = useState(null);

    useEffect(() => {
        if (user) {
            fetchGroup();
            fetchGroupMembers();
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


    const fetchGroupMembers = async () => {
        try {
            const data = await getAllGroupMember();
            if (data.statusCode === 200) {
                setGroupMemberData(data);
            }
            setStatus(null);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            // setStatus(error || "Error");
            setGroupMemberData(null);
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
                case 404:
                    type = "error";
                    message = "Submission id not found";
                    break;
                case 400:
                    type = "error";
                    message = "Invalid project ID";
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

    const handleApprove = async (submissionId) => {
        await updateStatus(submissionId, 'approved');
    };

    const handleReject = async (submissionId) => {
        await updateStatus(submissionId, 'rejected');
    };

    const updateStatus = async (submissionId, mentorApproval) => {
        console.log(submissionId, mentorApproval)
        setSubmitting(true);
        try {
            const data = await updateSubmissionStatus(submissionId, mentorApproval);
            if (data.statusCode === 200) {
                console.log(data) // Set projects array if response is successful
            } else {
                // Handle error cases here
                console.error("Error updating submission status:", data.message);
            }
            setStatus(data.statusCode);
            setSubmitting(false);
        } catch (error) {
            console.error("Error updating submission status:", error.message);
            setStatus(error || "Error");
            setSubmitting(false);
        }
    };

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
                                                {groupData && groupData.data && groupMemberData && groupMemberData.data.length > 0 &&
                                                    groupData.data
                                                        .filter(group =>
                                                            groupMemberData.data.some(member =>
                                                                member.group_id === group._id &&
                                                                member.member_role.toLowerCase() === 'mentor' &&
                                                                member.user_id === user._id
                                                            )
                                                        )
                                                        .map(group => (
                                                            <option key={group._id} value={group._id}>
                                                                {group.name}
                                                            </option>
                                                        ))}
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
                                                <>
                                                    <button onClick={() => handleApprove(project._id)} className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-green-600 rounded cursor-pointer hover:bg-gray-500">Approve</button>
                                                    <button onClick={() => handleReject(project._id)} className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-red-600 rounded cursor-pointer hover:bg-gray-500">Reject</button>
                                                </>
                                            ) : (
                                                <span className={`px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform rounded cursor-pointer hover:bg-gray-500 ${project.submission.mentorApproval === 'approved' ? 'bg-green-600' : 'bg-red-600'}`}>{project.submission.mentorApproval.toUpperCase()}</span>
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

