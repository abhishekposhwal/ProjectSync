import React, { useState, useEffect, useContext } from 'react';
import { registerUserProfile, updateUserProfile, getUserProfile } from '../../Api/profileApi';
import { AuthContext } from '../../context/AuthContext';
// import { Alert } from "../../helper/notification";
import { getAllCourses, registerCourse, deleteCourse } from '../../Api/courseApi';
import { registerDepartment, getAllDepartments, deleteDepartment } from '../../Api/departmentApi';
import { Alert } from "../../helper/notification";

import { getAllProjectCategory } from '../../Api/projectCategoryApi.js';

export default function CardSettings() {
  const { user } = useContext(AuthContext);

  const [mode, setMode] = useState("register");

  const [formData, setFormData] = useState({
    rollNumber: "",
    section: "",
    course: "",
    department: "",
    roleDuringProject: "",
    academicYear: "",
  });


  const [profileData, setProfileData] = useState(null);
  const [message, setMessage] = useState("");
  const [courseData, setCourseData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);
  const [status, setStatus] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const [submitting, setSubmitting] = useState(false);
  const [projectCategoryData, setProjectCategoryData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchDepartments();
      fetchProjectCategory();
    }
  }, [user]);

  useEffect(() => {
    if (status) {
      let type = "success";
      let message = "";
      switch (status) {
        case 400:
          type = "error";
          message = "Invalid user profile id";
          break;
        case 404:
          type = "error";
          message = "User profile not found";
          break;
        case 500:
          type = "error";
          message = "Something went wrong while updating the user profile";
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

  const fetchProjectCategory = async () => {
    try {
      const data = await getAllProjectCategory();
      setProjectCategoryData(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    setFormData({ ...formData, course: selectedCourseId, department: '' });
  };





  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  };


  // const [mode, setMode] = useState('register');


  useEffect(() => {
    if (profileData && profileData.data) {
      setMode("update");
      const {
        rollNumber,
        section,
        course,
        department,
        roleDuringProject,
        academicYear,
        areasOfExpertise,
        experience
      } = profileData.data;
      setFormData({
        rollNumber: rollNumber || "",
        section: section || "",
        course: course || "",
        department: department || "",
        roleDuringProject: roleDuringProject || "",
        academicYear: academicYear || "",
        areasOfExpertise: areasOfExpertise || "",
        experience: experience || ""
      });

      console.log(profileData.data._id, profileData);
    } else {
      setMode("register");
      setFormData({
        rollNumber: "",
        section: "",
        course: "",
        department: "",
        roleDuringProject: "",
        academicYear: "",
        areasOfExpertise: "",
        experience: ""
      });
    }
  }, [profileData])

  console.log(formData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "register") {
        // Register user profile
        const response = await registerUserProfile(formData);
        setStatus(response.statusCode);
        setSubmitting(false);
      } else if (mode === "update") {
        // Update user profile
        const userProfileId = profileData.data._id;
        const response = await updateUserProfile(userProfileId, formData);
        setStatus(response.statusCode);
        setSubmitting(false);


      }
      // Handle success
      console.log(`${mode === "register" ? "Registered" : "Updated"} profile successfully!`);
    } catch (error) {
      // Handle error
      console.error("Error:", error);
      setStatus("Error");
      setSubmitting(false);
    }
  };


  return (
    <>
      {message && <Alert type={alertType} message={message} />}

      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">My account</h6>
            <button
              className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
              type="submit"
              onClick={handleSubmit}
            >
              {mode === "register" ? "Register" : "Update"}
            </button>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form onSubmit={handleSubmit}>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Profile Information
            </h6>
            <div className="flex flex-wrap">
              {user.userRole === 'student' && (
                <>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="rollNumber"
                      >
                        Roll No
                      </label>
                      <input
                        type="text"
                        id="rollNumber"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.rollNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, rollNumber: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="section"
                      >
                        Section
                      </label>
                      <input
                        type="text"
                        id="section"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.section}
                        onChange={(e) =>
                          setFormData({ ...formData, section: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="course"
                      >
                        Course
                      </label>
                      <select
                        id="course"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.course}
                        onChange={handleCourseChange}
                      >
                        <option value="">Select Course</option>
                        {courseData && courseData.data && courseData.data.map(course => (
                          <option key={course.id} value={course._id}>{course.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='w-full lg:w-6/12 px-4'>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="department"
                      >
                        Department
                      </label>
                      <select
                        id="department"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                        disabled={!formData.course}
                      >
                        <option value="">Select Department</option>
                        {departmentData && departmentData.data && Array.isArray(departmentData.data) &&
                          departmentData.data
                            .filter(department => department.courseId === formData.course)
                            .map(department => (
                              <option key={department._id} value={department._id}>{department.name}</option>
                            ))
                        }

                      </select>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="roleDuringProject"
                      >
                        role during Project
                      </label>
                      <input
                        type="text"
                        id="roleDuringProject"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.roleDuringProject}
                        onChange={(e) =>
                          setFormData({ ...formData, roleDuringProject: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="academicYear"
                      >
                        Academic Year
                      </label>
                      <input
                        type="text"
                        id="academicYear"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.academicYear}
                        onChange={(e) =>
                          setFormData({ ...formData, academicYear: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
              {user.userRole !== 'student' && (
                <>
                  <div className='w-full lg:w-6/12 px-4'>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="department"
                      >
                        Department
                      </label>
                      <select
                        id="department"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                      >
                        <option value="">Select Department</option>
                        {departmentData && departmentData.data && Array.isArray(departmentData.data) &&
                          departmentData.data
                            .map(department => (
                              <option key={department._id} value={department._id}>{department.name}</option>
                            ))
                        }

                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">

                      <select
                        name="projectCategoryId"
                        id="projectCategoryId"
                        required
                        value={formData.projectCategoryId}
                        onChange={(e) =>
                          setFormData({ ...formData, areasOfExpertise: e.target.value })
                        }
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
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="experience"
                      >
                        Experience
                      </label>
                      <input
                        type="text"
                        id="experience"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({ ...formData, experience: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Add input fields for course, department, roleDuringProject, academicYear */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
