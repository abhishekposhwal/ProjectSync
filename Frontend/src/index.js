import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import "@fortawesome/fontawesome-free/css/all.min.css";
// import "assets/styles/index.css"
// import { UserProvider } from '../src/userContext.js';

// layouts

import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import Student from "layouts/Student.js";
import Mentor from "layouts/Mentor";

// views without layouts

import Landing from "views/Landing.js";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from './routes/privateRoutes';



import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/css/tailwind.css";
// import { ThemeProvider } from "@material-tailwind/react";

// import Teacher from './pages/Teacher';
// import HOD from './pages/HOD';
// import Dashboard from './pages/Dashboard';


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    {/* <ThemeProvider> */}
    <Router>
      <Switch>
        {/* Routes with specific layouts */}
        <PrivateRoute path="/admin" roles={['admin']} component={Admin} />
        <PrivateRoute path="/student" roles={['student']} component={Student} />
        <PrivateRoute path="/teacher" roles={['teacher']} component={Mentor} />
        {/* <PrivateRoute path="/hod" roles={['hod']} component={HOD} /> */}

        {/* Route for authentication */}
        <Route path="/auth" component={Auth} />

        {/* General dashboard route accessible to all roles */}
        {/* <PrivateRoute path="/dashboard" roles={['admin', 'student', 'hod', 'teacher']} component={Dashboard} /> */}

        {/* Public landing page */}
        <Route path="/" exact component={Landing} />

        {/* Redirect any unmatched routes to landing page */}
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
    {/* </ThemeProvider> */}
  </AuthProvider>
);
