import { asyncHandler } from "../utils/asyncHandler.js"; //  asyncHandler utility for handling asynchronous operations
import { ApiError } from "../utils/apiError.js";
import { Course } from "../models/course.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";

const registerCourse = asyncHandler(async (req, res) => {
    // get Course details from frontend
    // validation - not empty
    // craete Course object - create entry in db
    // check for Course creation
    // return response

    // Get Course details from the request body
    const { name, duration, description } = req.body
    console.log('Course Name', name)

    // Validate that all required fields are present and not empty
    if (![name, duration].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if course already exists
    const existedCourse = await Course.findOne({
        $or: [{ name }]
    })

    if (existedCourse) {
        throw new ApiError(409, "Course already exists")
    }

    // Create a new course in the database
    const course = await Course.create({
        name,
        duration,
        description
    });
    console.log("Course", course);

    // Fetch the created course from the database
    const createdCourse = await Course.findById(course._id);


    if (!createdCourse) {
        throw new ApiError(500, "Something went wrong while inserting the course into the database")
    }

    // Return success response with the registered course details
    return res.status(200).json(
        new ApiResponse(200, createdCourse, "Course Details inserted Successfully")
    )
})


const getAllCourses = asyncHandler(async (req, res) => {
    try {
        const course = await Course.find();
        if (!course || course.length === 0) {
            throw new ApiError(404, "No course found");
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                course,
                "Courses fetched successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to fetch all courses");
    }
});

const updateCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params
    const { name, duration, description } = req.body;

    if (!courseId) {
        throw new ApiError(400, " Invalid course id")
    }

    if (![name, duration].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    const course = await Course.findByIdAndUpdate(
        courseId,
        {
            $set: {
                name: name,
                duration: duration,
                description: description
            },
        },
        { new: true }

    );

    if (!course) {
        throw new ApiError(500, "Failed to update course details. please try again!!");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            course,
            "Course details updated successfully"
        ))
})

const deleteCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params

    console.log("Course id", courseId);

    if (!isValidObjectId(courseId)) {
        throw new ApiError(400, "Invalid course id");
    }

    const course = await Course.findById(courseId);

    console.log("User ROle", course);

    if (!course) {
        throw new ApiError(404, "No Course found");
    }

    const courseDeleted = await Course.findByIdAndDelete(course?._id);

    if (!courseDeleted) {
        throw new ApiError(400, "Failed to delete the course. please try again!!");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Course deleted successfully"
        ))
})



export {
    registerCourse,
    getAllCourses,
    updateCourse,
    deleteCourse
}