import React, { useState, useEffect, useContext } from 'react';
import { registerProjectCategory, getAllProjectCategory, deleteProjectCategory } from '../../Api/projectCategoryApi.js'; // Assuming registerCourse is exported from the API file
import { AuthContext } from '../../context/AuthContext.js';
import { Alert } from "../../helper/notification.js";

// Components
import CardTable from "../../components/Cards/CardTable.js";

export default function Group() {
    const { user } = useContext(AuthContext);
    const [projectCategoryData, setProjectCategoryData] = useState(null);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "" });
    const [submitting, setSubmitting] = useState(false);
    const [alertType, setAlertType] = useState("success"); // Default type

    useEffect(() => {
        if (user) {
            fetchProjectCategory();
        }
    }, [user]);

    const fetchProjectCategory = async () => {
        try {
            const data = await getAllProjectCategory();
            setProjectCategoryData(data);
            setStatus(null);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            setStatus(error || "Error");
        }
    };

    useEffect(() => {
        if (status) {
            let type = "success";
            let message = "";
            switch (status) {
                case 400:
                    type = "error";
                    message = "The project category cannot be empty. Please provide a valid project category.";
                    break;
                case 409:
                    type = "error";
                    message = "The project Category already exists. Please choose a different category.";
                    break;
                case 200:
                    type = "success";
                    message = "Good job! Operation done successfully.";
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

    let columns = [];
    let data = [];

    if (projectCategoryData && projectCategoryData.data) {
        columns = ["Project Category Name"];
        data = projectCategoryData.data.map((category) => ({
            _id: category._id, // Include the _id in the data
            "Project Category Name": category.name
        }));
    }


    const addButtonName = "Project Category";
    const totalBadgeName = "Project Category";

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const refreshTable = () => {
        getAllProjectCategory();
    }

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
            const response = await registerProjectCategory(formData);
            setStatus(response.statusCode);
            setSubmitting(false);
            setIsOpen(false);
            setFormData({ name: "" }); // Reset the form data
            // Optionally, you can fetch courses again to update the list
        } catch (error) {
            console.error("Error registering user:", error.message);
            setStatus(error || "Error");
            setSubmitting(false);
        }
    };

    const handleDelete = async (projectCategoryid) => {
        try {
            const response = await deleteProjectCategory(projectCategoryid);
            console.log(projectCategoryid);// Assuming courseId is the id of the course
            setStatus(response.statusCode);
            // fetchUsers(); // Fetch courses again to update the list
        } catch (error) {
            console.error("Error deleting project category:", error.message);
            setStatus(error.response?.status || "Error");
        }
    };
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
                                    <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white text-center" id="modal-title">Add Project Category</h3>
                                    <form onSubmit={handleSubmit} className="mt-4" action="#">
                                        <label className="block mt-3" htmlFor="category">
                                            <input type="text" name="name" id="name" placeholder="Project Category Name" value={formData.name} onChange={handleChange} className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
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

            {message && <Alert type={alertType} message={message} />}
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <CardTable color="light" columns={columns} data={data} addButtonName={addButtonName} totalBadgeName={totalBadgeName} handleOpenModal={handleOpenModal}
                        handleDelete={handleDelete} refreshTable={refreshTable} />
                </div>
            </div>
        </>
    );
}

