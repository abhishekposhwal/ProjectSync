import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

// app.use(cors({
//         origin: process.env.CORS_ORIGIN,
//         credentials: true
// }))
// Define the allowed origins
const allowedOrigins = ['http://localhost:3001'];
const corsOptions = {
        origin: function (origin, callback) {
                // Check if the origin is in the allowed list or not
                if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                        callback(null, true);
                } else {
                        callback(new Error('Not allowed by CORS'));
                }
        },
        credentials: true // This allows the server to accept cookies
};

// Use the CORS middleware
app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";
import userProfile from "./routes/userProfile.routes.js";
import userRoleRouter from "./routes/userRole.routes.js";
import courseRouter from "./routes/course.routes.js";
import departmentRouter from "./routes/department.routes.js";
import projectCategoryRouter from "./routes/projectCategory.routes.js";
import group from "./routes/group.routes.js";
import groupMember from "./routes/groupMember.routes.js";
import projectRouter from "./routes/project.routes.js";
import submissionRouter from "./routes/submission.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import panelRouter from "./routes/panel.routes.js";
//routes declaration
app.use("/api/v1/users", userRouter, userProfile, groupMember, projectRouter, submissionRouter, feedbackRouter, courseRouter)
app.use("/api/v1/admin", userRoleRouter, courseRouter, departmentRouter, projectCategoryRouter, group, groupMember, panelRouter, projectRouter)

export { app }