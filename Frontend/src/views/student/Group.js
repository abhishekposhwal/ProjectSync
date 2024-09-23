import React, { useState, useEffect, useContext } from 'react';
import { getGroupMembers, registerGroupMember } from '../../Api/groupMemberApi'; // Assuming registerCourse is exported from the API file
import { registerGroup, getAllGroup, deleteGroup } from '../../Api/groupApi'; // Assuming registerCourse is exported from the API file
import { AuthContext } from '../../context/AuthContext';
import { Alert } from "../../helper/notification";
import { getAllUsers } from '../../Api/userApi';

// Components
// import CardGroup from "../../components/Cards/CardGroup";

export default function Group() {
    const { user } = useContext(AuthContext);
    const [groupData, setGroupData] = useState(null);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenMember, setIsOpenMember] = useState(false);
    const [formData, setFormData] = useState({ groupName: "" });
    const [memberFormData, setMemberFormData] = useState({ groupId: "", userid: "", memberRole: "" });
    const [submitting, setSubmitting] = useState(false);
    const [alertType, setAlertType] = useState("success"); // Default type
    const [userData, setUserData] = useState(null);
    const [allStudents, setAllStudents] = useState([]);
    const [isOpenMemberDetails, setIsOpenMemberDetails] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [groupMemberData, setGroupMemberData] = useState(null);


    useEffect(() => {
        if (user) {
            fetchGroup();
            fetchUsers();
            fetchGroupMembers(selectedGroupId);
        }
    }, [user, selectedGroupId]);

    const fetchGroup = async () => {
        try {
            const data = await getAllGroup();
            setGroupData(data);
            setStatus(null);
        } catch (error) {
            console.error("Error fetching group:", error.message);
            setStatus(error || "Error");
        }
    };

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

    const fetchGroupMembers = async (groupId) => {
        try {
            const data = await getGroupMembers(groupId);
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

    useEffect(() => {
        if (userData && Array.isArray(userData.data)) {
            const students = userData.data.filter(user => user.userRole === "student");
            setAllStudents(students);
        }
    }, [userData]);


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

    const addButtonName = "New Group";
    const totalBadgeName = "Groups";

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleOpenMemberModal = () => {
        setIsOpenMember(true);
    };

    const handleCloseMemberModal = () => {
        setIsOpenMember(false);
    };

    const handleOpenMemberDetailsModal = (groupId) => {
        setSelectedGroupId(groupId);
        setIsOpenMemberDetails(true);
    };

    const handleCloseMemberDetailsModal = () => {
        setIsOpenMemberDetails(false);
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleChangeForMember = (e) => {
        const { name, value } = e.target;
        setMemberFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await registerGroup(formData);
            setStatus(response.statusCode);
            setSubmitting(false);
            setIsOpen(false);
            setFormData({ groupName: "" }); // Reset the form data
            // Optionally, you can fetch courses again to update the list
        } catch (error) {
            console.error("Error registering user:", error.message);
            setStatus(error || "Error");
            setSubmitting(false);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        try {
            const response = await deleteGroup(groupId); // Assuming courseId is the id of the course
            setStatus(response.statusCode);
            // fetchUsers(); // Fetch courses again to update the list
        } catch (error) {
            console.error("Error deleting course:", error.message);
            setStatus(error.response?.status || "Error");
        }
    };


    const registerGropMember = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await registerGroupMember(memberFormData);
            setStatus(response.statusCode);
            setSubmitting(false);
            setIsOpen(false);
            setMemberFormData({ groupId: "", userid: "", memberRole: "" }); // Reset the form data
            // Optionally, you can fetch courses again to update the list
        } catch (error) {
            console.error("Error registering user:", error.message);
            setStatus(error || "Error");
            setSubmitting(false);
        }
    };


    console.log("groupMemberData", groupData)
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="mt-10 relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>

                                <div className="mt-2">
                                    <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white text-center" id="modal-title">Add Group</h3>
                                    <form onSubmit={handleSubmit} className="mt-4" action="#">
                                        <label className="block mt-3" htmlFor="groupName">
                                            <input type="text" name="groupName" id="groupName" placeholder="Group Name" value={formData.groupName} onChange={handleChange} className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
                                        </label>


                                        <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                                            <button type="button" onClick={handleCloseModal} className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40" disabled={submitting}>
                                                Cancel
                                            </button>

                                            <button type="submit" className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" disabled={submitting}>
                                                {submitting ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isOpenMember && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm"
                        onClick={handleCloseMemberModal}
                    ></div>
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="mt-10 relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                <div className="flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                        />
                                    </svg>
                                </div>

                                <div className="mt-2">
                                    <h3
                                        className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white text-center"
                                        id="modal-title"
                                    >
                                        Add Member
                                    </h3>
                                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        Your new group has been successfully created.
                                        Now it's time to invite your team to collaborate on this project.
                                        Together, we can achieve great things!</p>
                                    <form onSubmit={registerGropMember} className="mt-4" action="#">
                                        <label className="block mt-3" htmlFor="groupId">
                                            <select
                                                name="groupId"
                                                id="groupId"
                                                value={memberFormData.groupId}
                                                onChange={handleChangeForMember}
                                                className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                            >
                                                <option value="" disabled>
                                                    Select Group
                                                </option>
                                                {groupData.data.map((group) => {
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
                                        </label>


                                        <label className="block mt-3" htmlFor="userId">
                                            <select
                                                name="userId"
                                                id="userId"
                                                value={memberFormData.userId}
                                                onChange={handleChangeForMember}
                                                className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                            >
                                                <option value="" disabled>
                                                    Student
                                                </option>
                                                {allStudents.map((student) => (
                                                    <option key={student._id} value={student._id}>
                                                        {`${student.fullName}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>



                                        <label className="block mt-3" htmlFor="memberRole">
                                            <select
                                                name="memberRole"
                                                id="memberRole"
                                                value={memberFormData.memberRole}
                                                onChange={handleChangeForMember}
                                                className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                                            >
                                                <option value="Leader">Leader</option>
                                                <option value="Member">Member</option>
                                            </select>
                                        </label>

                                        <div className="mt-4 sm:flex sm:items-center sm:-mx-2">
                                            <button
                                                type="button"
                                                onClick={handleCloseMemberModal}
                                                className="w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                                                disabled={submitting}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                                disabled={submitting}
                                            >
                                                {submitting ? "Submitting..." : "Submit"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {message && <Alert type={alertType} message={message} />}


            {isOpenMemberDetails && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-sm"
                        onClick={handleCloseMemberDetailsModal}
                    ></div>
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="mt-10 relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>


                                <div className="mt-2">

                                    <div>
                                        <div class="flex items-center justify-center ">
                                            <img class="object-cover w-12 h-12 rounded-full ring ring-white" src="https://images.unsplash.com/photo-1490195117352-aa267f47f2d9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="" />
                                            <img class="object-cover w-12 h-12 -mx-4 rounded-full ring ring-white" src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="" />
                                            <img class="object-cover w-12 h-12 rounded-full ring ring-white" src="https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="" />
                                        </div>

                                        <div class="mt-4 text-center">
                                            <h3 class="font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
                                                Invite your team
                                            </h3>

                                            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                Your new group has been successfully created.
                                                Now it's time to invite your team to collaborate on this project.
                                                Together, we can achieve great things!
                                            </p>
                                        </div>
                                    </div>

                                    <h3 class="font-medium leading-6 text-gray-800 capitalize dark:text-white mt-5 " id="modal-title">
                                        Group Name
                                    </h3>

                                    <div>
                                        {groupMemberData && groupMemberData.statusCode === 200 && groupMemberData.data && groupMemberData.data.length > 0 ? (
                                            groupMemberData.data.map((member, index) => (
                                                <div key={index} className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 mt-3 mb-3">
                                                    <div className="w-2 bg-gray-800 dark:bg-gray-900"></div>
                                                    <div className="flex items-center px-2 py-3">
                                                        <img className="object-cover w-10 h-10 rounded-full" alt="User avatar" src="https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=200" />
                                                        <div className="mx-3">
                                                            <p className="text-gray-600 dark:text-gray-200 text-sm">{member.userInfo.name}</p>
                                                            <p className="text-gray-600 dark:text-gray-200 text-sm">{member.userInfo.email}</p>
                                                            <p className="text-gray-600 dark:text-gray-200 text-sm">{member.userInfo.member_role}</p>
                                                        </div>
                                                        <div className="mx-3">
                                                            <p className="text-gray-600 dark:text-gray-200 text-sm">{member.userInfo.gender}</p>
                                                            <p className="text-gray-600 dark:text-gray-200 text-sm">{member.userInfo.mobileNumber}</p>
                                                            <p className="text-gray-600 dark:text-gray-200 text-sm">{member.userInfo.rollNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className='text-gray-600 dark:text-gray-200 text-sm text-center mt-5 mb-5'>No group members found.</p>
                                        )}


                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCloseMemberDetailsModal}
                                        className="mt-5 w-full py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-full  dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            <div className="flex flex-wrap mt-4 mb-5 py-5">
                <div className="w-full mb-12 px-4">
                    <div
                        className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded  bg-white
                            }`}
                    >
                        <div className="block w-full overflow-x-auto">
                            <section className="container px-4 mx-auto">
                                <div className="sm:flex sm:items-center sm:justify-between mt-5">
                                    <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                                        {totalBadgeName}
                                    </h2>
                                    <div className="flex items-center mt-4 gap-x-3">
                                        {/* <button onClick={refreshTable} class="w-1/2 px-5 py-2 text-sm text-gray-800 transition-colors duration-200 bg-white border rounded-lg sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-white dark:border-gray-700">
                                            Refresh
                                        </button> */}

                                        {addButtonName && (
                                            <button onClick={handleOpenModal} className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <span>{addButtonName}</span>
                                            </button>
                                        )}
                                        {addButtonName && (
                                            <button onClick={handleOpenMemberModal} className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <span>New Member</span>
                                            </button>
                                        )}

                                    </div>
                                </div>
                                <section className="container px-4 mx-auto">
                                    <div className="flex flex-col mt-6">
                                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">

                                                <div className="flex flex-wrap justify-between">
                                                    {groupData && groupData.data && groupData.data
                                                        .filter(group => group.createdBy === user._id) // Filter groups created by the current user
                                                        .map((group, groupIndex) => (
                                                            <div key={groupIndex} className="w-full sm:w-1/2 md:w-1/2 lg:w-2/4 xl:w-3/6 px-2 mb-4">
                                                                <div className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                                                                    <div className="p-6">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm font-light text-gray-600 dark:text-gray-400">
                                                                                Created at {new Date(group.createdAt).toLocaleDateString()}
                                                                            </span>

                                                                            <button onClick={() => handleOpenMemberDetailsModal(group._id)} class="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
                                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>

                                                                        <div className="flex items-center justify-between">
                                                                            <span className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600">
                                                                                {group.name}
                                                                            </span>
                                                                            <button onClick={() => handleDeleteGroup(group._id)} class="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
                                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>



                                                {groupData && groupData.length === 0 && (
                                                    <div className="flex items-center mt-6 text-center border rounded-lg h-96 dark:border-gray-700 mb-5">
                                                        <div className="flex flex-col w-full max-w-sm px-4 mx-auto">
                                                            <div className="p-3 mx-auto text-blue-500 bg-blue-100 rounded-full dark:bg-gray-800">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth="1.5"
                                                                    stroke="currentColor"
                                                                    className="w-6 h-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <h1 className="mt-3 text-lg text-gray-800 dark:text-white">
                                                                No Group found
                                                            </h1>
                                                            <p className="mt-2 text-gray-500 dark:text-gray-400">
                                                                No group has been created yet. Please try again or create a new group.
                                                            </p>
                                                            <div className="flex items-center mt-4 sm:mx-auto gap-x-3">
                                                                {addButtonName && (
                                                                    <button onClick={handleOpenModal} className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto gap-x-2 hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth="1.5"
                                                                            stroke="currentColor"
                                                                            className="w-5 h-5"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                            />
                                                                        </svg>
                                                                        <span>{addButtonName}</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                            </section>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

