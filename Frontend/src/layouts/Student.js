import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import StudentNavbar from "components/Navbars/StudentNavbar.js";
import Sidebar from "components/Sidebar/StudentSidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/student/Dashboard.js";
import Project from "views/student/Project";
import Settings from "views/student/Settings.js";
import Group from "views/student/Group.js";
import Submission from "views/student/Submission";

export default function Student() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <StudentNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/student/dashboard" exact component={Dashboard} />
            <Route path="/student/groups" exact component={Group} />
            <Route path="/student/settings" exact component={Settings} />
            <Route path="/student/projects" exact component={Project} />
            <Route path="/student/submissions" exact component={Submission} />
            <Redirect from="/student" to="/student/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
