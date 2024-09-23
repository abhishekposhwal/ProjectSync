import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
// import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";
import { getAllGroupMembers } from "../../Api/groupMemberApi";
import { AuthContext } from "../../context/AuthContext";
import { getProjectDetails } from '../../Api/projectApi';

export default function Dashboard() {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchGroupMembers();
    }
  }, [user]);

  const fetchGroupMembers = async () => {
    try {
      const data = await getAllGroupMembers();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching group members:", error.message);
    }
  };


  const [projectData, setProjectData] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProject();
    }
  }, [user]);

  const fetchProject = async () => {
    try {
      const data = await getProjectDetails();
      setProjectData(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };


  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
          {projectData && (
            <CardSocialTraffic
              tableName="Projects"
              headers={["Group Name", "Project Title", "Category", "Required Technology"]}
              data={projectData.data.map(project => [
                project.groupName,
                project.title,
                project.category,
                project.requiredTechnology,
              ])}
              onSeeAll={() => history.push("/admin/projects")}
            />
          )}
        </div>
        <div className="w-full xl:w-4/12 px-4">
          {userData && (
            <CardSocialTraffic
              tableName="Groups"
              headers={["Group Name", "Members"]}
              data={userData.data.map(group => [
                group.name,
                group.memberCountFiltered
              ])}
              onSeeAll={() => history.push("/admin/groups")}
            />
          )}
        </div>
      </div>
    </>
  );
}
