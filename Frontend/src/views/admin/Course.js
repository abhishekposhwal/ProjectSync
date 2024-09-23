import React, { useState, useEffect, useContext } from 'react';
import { getAllCourses, registerCourse, deleteCourse } from '../../Api/courseApi';
import { registerDepartment, getAllDepartments, deleteDepartment } from '../../Api/departmentApi';
import { AuthContext } from '../../context/AuthContext';
import { Alert } from "../../helper/notification";
import CardTable from "../../components/Cards/CardTable.js";

export default function Course() {
  const { user } = useContext(AuthContext);
  const [courseData, setCourseData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState(''); // '' for no form, 'course' for course form, 'department' for department form
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    courseId: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchDepartments();
    }
  }, [user]);

  useEffect(() => {
    if (status) {
      let type = "success";
      let message = "";
      switch (status) {
        case 400:
          type = "error";
          message = "The filed  cannot be empty. Please provide a valid  name.";
          break;
        case 409:
          type = "error";
          message = "Name already exists. Please choose a different name.";
          break;
        case 500:
          type = "error";
          message = "Something went wrong while inserting the data into the database";
          break;
        case 200:
          type = "success";
          message = "The data was submitted successfully.";
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


  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourseData(data);
      setStatus(null);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
      setStatus(error || "Error");
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await getAllDepartments();
      setDepartmentData(data);
      setStatus(null);
    } catch (error) {
      console.error("Error fetching departments:", error.message);
      setStatus(error || "Error");
    }
  };

  let columns = [];
  let data = [];
  if (courseData && courseData.data) {
    columns = ["Course Name", "Duration"];
    data = courseData.data.map(course => ({
      _id: course._id,
      "Course Name": course.name,
      "Duration": course.duration,
    }));
  }
  const addButtonName = "Course";
  const totalBadgeName = "Courses";

  const handleOpenModal = (type) => {
    setFormType(type);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setFormType('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (formType === 'course') {
        // Submit course data
        try {
          const response = await registerCourse(formData);
          setStatus(response.statusCode);
          setSubmitting(false);
          setIsOpen(false);
          handleCloseModal();

        } catch (error) {
          console.error("Error registering course:", error.message);
          setStatus(error || "Error");
          setSubmitting(false);
        }

      } else if (formType === 'department') {

        try {
          const response = await registerDepartment(formData);
          setStatus(response.statusCode);
          setSubmitting(false);
          setIsOpen(false);

          handleCloseModal();

        } catch (error) {
          console.error("Error registering department:", error.message);
          setStatus(error || "Error");
          setSubmitting(false);
        }
      }
      // Handle success
      setSubmitting(false);
    } catch (error) {
      // Handle error
      setSubmitting(false);
    }
  };


  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await deleteCourse(courseId);
      setStatus(response.statusCode);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error.message);
      setStatus(error.response?.status || "Error");
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      const response = await deleteDepartment(departmentId);
      console.log(departmentId);
      setStatus(response.statusCode);
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error.message);
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
                  <h3 className="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white text-center" id="modal-title">
                    {formType === 'course' ? 'Add Course' : 'Add Department'}
                  </h3>
                  <form onSubmit={handleSubmit} className="mt-4" action="#">
                    {formType === 'course' && (
                      <>
                        <label className="block mt-3" htmlFor="courseName">
                          <input type="text" name="name" id="name" placeholder="Course Name" value={formData.name} onChange={handleChange} className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
                        </label>
                        <label className="block mt-3" htmlFor="duration">
                          <input type="text" name="duration" id="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
                        </label>
                      </>
                    )}

                    {formType === 'department' && (
                      <>
                        <label className="block mt-3" htmlFor="name">
                          <input type="text" name="name" id="name" placeholder="Department Name" value={formData.name} onChange={handleChange} className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
                        </label>
                        <label className="block mt-3" htmlFor="courseId">
                          <select name="courseId" id="courseId" value={formData.courseId} onChange={handleChange} className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300">
                            <option value="" disabled>Select Course</option>
                            {courseData.data.map((course) => (
                              <option key={course._id} value={course._id}>{course.name}</option>
                            ))}
                          </select>
                        </label>
                        <label className="block mt-3" htmlFor="description">
                          <textarea name="description" id="description" placeholder="Description" value={formData.description} onChange={handleChange} className="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"></textarea>
                        </label>
                      </>
                    )}

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
        <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
          <CardTable
            color="light"
            columns={columns}
            data={data}
            addButtonName={addButtonName}
            totalBadgeName={totalBadgeName}
            handleOpenModal={() => handleOpenModal('course')}
            handleDelete={handleDeleteCourse}
          />
        </div>
        <div className="w-full xl:w-6/12 px-4">
          {departmentData && (
            <CardTable
              color="light"
              addButtonName="Add Department"
              totalBadgeName="Departments"
              columns={["Department Name", "Course Name", "Description"]}
              data={departmentData.data.map(department => ({
                _id: department._id,
                "Department Name": department.name,
                "Course Name": department.course || "", // Use empty string if course does not exist
                "Description": department.description || "", // Use empty string if description does not exist
              }))}
              handleDelete={handleDeleteDepartment}
              handleOpenModal={() => handleOpenModal('department')}
              formData={formData}
            />
          )}
        </div>
      </div>

    </>
  );
}

