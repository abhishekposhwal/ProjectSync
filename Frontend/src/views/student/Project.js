import React, { useState, useEffect, useContext } from 'react';
import { getAllGroup } from '../../Api/groupApi'; // Assuming registerCourse is exported from the API file
import { AuthContext } from '../../context/AuthContext';
import { Alert } from "../../helper/notification";
import { getAllProjectCategory } from '../../Api/projectCategoryApi.js';
import { registerProject } from '../../Api/projectApi';

export default function Settings() {
    const { user } = useContext(AuthContext);
    const [groupData, setGroupData] = useState(null);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    // const [isOpen, setIsOpen] = useState(false);
    // const [isOpenMember, setIsOpenMember] = useState(false);
    const [formData, setFormData] = useState({ title: "", projectCategoryId: "", introduction: "", problemStatement: "", requiredTechnology: "", softwareRequirement: "", hardwareRequirement: "", conclusion: "", references: "", groupId: "" });
    // const [memberFormData, setMemberFormData] = useState({ groupId: "", userid: "", memberRole: "" });
    const [submitting, setSubmitting] = useState(false);
    const [alertType, setAlertType] = useState("success"); // Default type
    // const [userData, setUserData] = useState(null);
    // const [allStudents, setAllStudents] = useState([]);
    // const [isOpenMemberDetails, setIsOpenMemberDetails] = useState(false);
    // const [selectedGroupId, setSelectedGroupId] = useState(null);
    // const [groupMemberData, setGroupMemberData] = useState(null);
    const [projectCategoryData, setProjectCategoryData] = useState(null);

    useEffect(() => {
        if (user) {
            fetchGroup();
            fetchProjectCategory();
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
    const fetchProjectCategory = async () => {
        try {
            const data = await getAllProjectCategory();
            setProjectCategoryData(data);
        } catch (error) {
            console.error("Error fetching users:", error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await registerProject(formData);
            setStatus(response.statusCode);
            setSubmitting(false);
            setFormData({ title: "", projectCategoryId: "", introduction: "", problemStatement: "", requiredTechnology: "", softwareRequirement: "", hardwareRequirement: "", conclusion: "", references: "", groupId: "" }); // Reset the form data
            // Optionally, you can fetch courses again to update the list
        } catch (error) {
            console.error("Error submitting Project Details:", error.message);
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
            <div className="flex justify-center">
                <div className="w-full xl:w-10/12">
                    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
                        <div className="block w-full overflow-x-auto">
                            <section className="max-w-4xl p-6 mx-auto  dark:bg-gray-800">
                                <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">Project Destails</h2>
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
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="projectCategory">Project Category</label>

                                            <select
                                                name="projectCategoryId"
                                                id="projectCategoryId"
                                                required
                                                value={formData.projectCategoryId}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                            >
                                                <option value="" disabled>
                                                    Select Project Category
                                                </option>
                                                {projectCategoryData && projectCategoryData.data.map((project) => (
                                                    // Check if the group was created by the current user
                                                    <option key={project._id} value={project._id}>
                                                        {project.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="title">Title</label>
                                            <input
                                                name="title"
                                                id="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                type="text"
                                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                        </div>
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="problemStatement">Problem Statement</label>
                                            <textarea name="problemStatement" id="problemStatement" value={formData.problemStatement} onChange={handleChange} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" rows="4"></textarea>
                                        </div>
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="introduction">Introduction</label>
                                            <textarea name="introduction" id="introduction" value={formData.introduction} onChange={handleChange} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" rows="4"></textarea>
                                        </div>
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="requiredTechnology">Required Technology</label>
                                            <textarea id="requiredTechnology" name="requiredTechnology" value={formData.requiredTechnology} onChange={handleChange} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" rows="4"></textarea>
                                        </div>
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="softwareRequirement">Software Requirement</label>
                                            <textarea id="softwareRequirement" name="softwareRequirement" value={formData.softwareRequirement} onChange={handleChange} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" rows="4"></textarea>
                                        </div>

                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="hardwareRequirement">Hardware Requirement</label>
                                            <textarea id="hardwareRequirement" name="hardwareRequirement" value={formData.hardwareRequirement} onChange={handleChange} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" rows="4"></textarea>
                                        </div>
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="conclusion">Conclusion</label>
                                            <textarea id="conclusion" name="conclusion" value={formData.conclusion} onChange={handleChange} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" rows="4"></textarea>
                                        </div>
                                        <div>
                                            <label className="text-gray-700 dark:text-gray-200" htmlFor="references">Refrences</label>
                                            <textarea id="references" name="references" value={formData.references} onChange={handleChange} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" rows="4"></textarea>
                                        </div>


                                    </div>
                                    <div class="flex justify-end mt-6">
                                        <button onClick={handleSubmit} class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Save</button>
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
