import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const { user } = useContext(AuthContext);

    if (user === undefined) {
        // Render a loading spinner or some kind of waiting message while user is being fetched
        return <div>Loading...</div>;
    }

    return (
        <Route
            {...rest}
            render={props => {
                if (!user) {
                    // Not logged in, redirect to login
                    return <Redirect to="/auth" />;
                }

                // Check if user's role matches the required roles for this route
                if (roles && roles.indexOf(user.userRole) === -1) {
                    // Role not authorized, redirect to role-specific page
                    const roleRedirectMap = {
                        admin: '/admin',
                        student: '/student',
                        hod: '/hod',
                        teacher: '/teacher'
                    };

                    return <Redirect to={roleRedirectMap[user.userRole] || '/'} />;
                }

                // Authorized, render the component
                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
