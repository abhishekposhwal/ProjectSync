import React, { useState, useEffect, useContext } from "react";
import CardStats from "components/Cards/CardStats.js";
import { getProjectDetails } from '../../Api/projectApi';
import { getAllUsers } from '../../Api/userApi';
import { AuthContext } from "../../context/AuthContext";
import { getAllGroup } from '../../Api/groupApi';

export default function HeaderStats() {
  const { user } = useContext(AuthContext);
  const [projectData, setProjectData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProject();
      fetchGroup();
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProject = async () => {
    try {
      const data = await getProjectDetails();
      setProjectData(data);
    } catch (error) {
      console.error("Error fetching projects:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroup = async () => {
    try {
      const data = await getAllGroup();
      setGroupData(data);
    } catch (error) {
      console.error("Error fetching groups:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getLength = (data) => {
    return Array.isArray(data) ? data.length : 0;
  };

  return (
    <>
      {/* Header */}
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Projects"
                  statTitle={loading ? 'Loading...' : getLength(projectData.data)}
                  statIconName="far fa-file-alt"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="USERS"
                  statTitle={loading ? 'Loading...' : getLength(userData.data)}
                  statIconName="fas fa-users"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Panel"
                  statTitle={loading ? 'Loading...' : getLength(groupData.data)}
                  statIconName="fas fa-users"
                  statIconColor="bg-pink-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Groups"
                  statTitle={loading ? 'Loading...' : getLength(groupData.data)}
                  statIconName="fas fa-users"
                  statIconColor="bg-lightBlue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
