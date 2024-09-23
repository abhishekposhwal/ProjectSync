import React, { useState, useEffect, useContext } from 'react';
import { getUserProfile } from '../../Api/profileApi';
import { AuthContext } from '../../context/AuthContext';
import { Alert } from "../../helper/notification";


// components

export default function CardProfile() {

  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfileData(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      setError(error || "Error");
    }
  };

  useEffect(() => {
    if (error && user.userRole !== 'admin') {
      switch (error) {
        case 400:
          setMessage("Invalid user id");
          break;
        case 404:
          setMessage("User profile not found || please update the profile");
          break;
        case 401:
          setMessage("Invalid user id");
          break;
        default:
          setMessage("Something went wrong");
      }
    } else {
      setMessage("");
    }
  }, [error, user.userRole]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
        {message && <Alert message={message} />}
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full px-4 flex justify-center">
              <div className="relative">
                <img
                  alt="..."
                  src={require("assets/img/team-1-800x800.jpg").default}
                  className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                />
              </div>
            </div>
            <div className="w-full px-4  text-center mt-20">
              <h3 className="text-xl font-semibold leading-normal mb-1 text-blueGray-700 mt-5">
                {user.fullName}
              </h3>
              <div className="text-sm leading-normal mt-0 mb-1 text-blueGray-400 font-bold ">
                {user.email}
              </div>
              {profileData?.data?.academicYear && (
                <>
                  <div className="mb-2 text-blueGray-600">
                    {profileData.data.academicYear}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-wrap mt-5">
            <div className="w-full lg:w-6/12 xl:w-6/12">
              {profileData?.data?.courseName && (
                <>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-address-card mr-2 text-lg text-blueGray-400"></i>
                    <b>Course</b> - {profileData.data.courseName}
                  </div>
                </>
              )}

              {profileData?.data?.department && (
                <>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                    <b>Department</b> - {profileData.data.departmentName}
                  </div>
                </>
              )}

              <div className="mb-2 text-blueGray-600">
                <i className="fas fa-phone mr-2 text-lg text-blueGray-400"></i>
                <b>Mobile No</b> - {user.mobile_no}
              </div>

              <div className="mb-2 text-blueGray-600">
                <i className="fas fa-venus-mars mr-2 text-lg text-blueGray-400"></i>
                <b>Gender</b> - {user.gender}
              </div>

            </div>

            <div className="w-full lg:w-6/12 xl:w-6/12">

              {profileData?.data?.rollNumber && (
                <>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-address-card mr-2 text-lg text-blueGray-400"></i>
                    <b>Roll No</b> - {profileData.data.rollNumber}
                  </div>
                </>
              )}

              {profileData?.data?.areasOfExpertise.length ? (
                <>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-address-card mr-2 text-lg text-blueGray-400"></i>
                    <b>Area of Expertise</b> - {profileData.data.areasOfExpertise}
                  </div>
                </>
              ) : ""}
              {profileData?.data?.experience ? (
                <>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                    <b>Experience</b> - {profileData.data.experience}
                  </div>
                </>
              ) : ""}

              {profileData?.data?.section && (
                <>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-address-card mr-2 text-lg text-blueGray-400"></i>
                    <b>Section</b> - {profileData.data.section}
                  </div>
                </>
              )}
              {profileData?.data?.roleDuringProject && (
                <>
                  <div className="mb-2 text-blueGray-600">
                    <i className="fas fa-user-circle mr-2 text-lg text-blueGray-400"></i>
                    <b>Role During Project</b> - {profileData.data.roleDuringProject}
                  </div>
                </>
              )}
            </div>
          </div>


          <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-9/12 px-4">
                <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                  "Believe in your dreams and keep pushing forward. Every challenge is a step closer to your success.
                  You are capable of amazing things"
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
