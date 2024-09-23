import React, { useState, useEffect, useContext } from 'react';
import { getGroupMembers, getAllGroupMember } from '../../Api/groupMemberApi'; // Assuming registerCourse is exported from the API file
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
    const [submitting, setSubmitting] = useState(false);
    const [alertType, setAlertType] = useState("success"); // Default type
    const [isOpenMemberDetails, setIsOpenMemberDetails] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [groupMemberData, setGroupMemberData] = useState(null);
    const [groupMemberDataByGroup, setGroupMemberDataByGroup] = useState(null);


    useEffect(() => {
        if (user) {
            fetchGroup();
            fetchGroupMembers();
            fetchGroupMembersByGroupId(selectedGroupId);
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


    const fetchGroupMembersByGroupId = async (groupId) => {
        try {
            const data = await getGroupMembers(groupId);
            if (data.statusCode === 200) {
                setGroupMemberDataByGroup(data);
            }
            setStatus(null);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            // setStatus(error || "Error");
            setGroupMemberDataByGroup(null);
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



    const handleOpenMemberDetailsModal = (groupId) => {
        setSelectedGroupId(groupId);
        setIsOpenMemberDetails(true);
    };

    const handleCloseMemberDetailsModal = () => {
        setIsOpenMemberDetails(false);
    };






    console.log("groupMemberData", groupMemberData)
    return (
        <>

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
                                        {groupMemberDataByGroup && groupMemberDataByGroup.statusCode === 200 && groupMemberDataByGroup.data && groupMemberDataByGroup.data.length > 0 ? (
                                            groupMemberDataByGroup.data
                                                .filter(member => member.member_role.toLowerCase() !== 'mentor') // Exclude mentors
                                                .map((member, index) => (
                                                    <div key={index} className="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 mt-3 mb-3">
                                                        <div className="w-2 bg-gray-800 dark:bg-gray-900"></div>
                                                        <div className="flex items-center px-2 py-3">
                                                            <img className="object-cover w-10 h-10 rounded-full" alt="User avatar" src="https://images.unsplash.com/photo-1477118476589-bff2c5c4cfbb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=200&q=200" />
                                                            <div className="mx-3">
                                                                <p className="text-gray-600 dark:text-gray-200 text-sm">{member.userInfo.name}</p>
                                                                <p className="text-gray-600 dark:text-gray-200 text-sm">{member.userInfo.email}</p>
                                                                <p className="text-gray-600 dark:text-gray-200 text-sm">{member.member_role}</p>
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
                                        Groups
                                    </h2>
                                    <div className="flex items-center mt-4 gap-x-3">


                                    </div>
                                </div>
                                <section className="container px-4 mx-auto">
                                    <div className="flex flex-col mt-6">
                                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                                <div className="flex flex-wrap justify-between">
                                                    {groupData && groupData.data && groupMemberData && groupMemberData.data.length > 0 && groupData.data
                                                        .filter(group =>
                                                            groupMemberData.data.some(member =>
                                                                member.group_id === group._id &&
                                                                member.member_role.toLowerCase() === 'mentor' &&
                                                                member.user_id === user._id
                                                            )
                                                        )
                                                        .map((group, groupIndex) => (
                                                            <div key={groupIndex} className="w-full sm:w-1/2 md:w-1/2 lg:w-2/4 xl:w-3/6 px-2 mb-4">
                                                                <div className="overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                                                                    <div className="p-6">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm font-light text-gray-600 dark:text-gray-400">
                                                                                Assign at {new Date(group.createdAt).toLocaleDateString()}
                                                                            </span>

                                                                            <button onClick={() => handleOpenMemberDetailsModal(group._id)} className="px-4 py-2 font-medium text-gray-600 transition-colors duration-200 sm:px-6 dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>

                                                                        <div className="flex items-center justify-between">
                                                                            <span className="block mt-2 text-xl font-semibold text-gray-800 transition-colors duration-300 transform dark:text-white hover:text-gray-600">
                                                                                {group.name}
                                                                            </span>
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

