import { asyncHandler } from "../utils/asyncHandler.js"; //  asyncHandler utility for handling asynchronous operations
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Department } from "../models/department.model.js";

const registerDepartment = asyncHandler(async (req, res) => {
    // get Department details from frontend
    // validation - not empty
    // craete Department object - create entry in db
    // check for Department creation
    // return response

    // Get Department details from the request body
    const { name, description, courseId } = req.body
    console.log('Department Name', name)

    // Validate that all required fields are present and not empty
    if (![name].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if Department already exists
    const existedDepartment = await Department.findOne({
        $or: [{ name }]
    })

    if (existedDepartment) {
        throw new ApiError(409, "Department already exists")
    }

    // Create a new Department in the database
    const course = await Department.create({
        name,
        description,
        courseId
    });

    // Fetch the created Department from the database
    const createdDepartment = await Department.findById(course._id);


    if (!createdDepartment) {
        throw new ApiError(500, "Something went wrong while inserting the Department into the database")
    }

    // Return success response with the registered Department details
    return res.status(200).json(
        new ApiResponse(200, createdDepartment, "Department Details inserted Successfully")
    )
})


const getAllDepartments = asyncHandler(async (req, res) => {
    try {
        const departments = await Department.find();

        // Aggregate department details including associated course
        const departmentDetails = await Department.aggregate([
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            {
                $addFields: {
                    course: {
                        $arrayElemAt: ["$courseDetails.name", 0],
                    }
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    course: 1,
                    courseId: 1
                },
            },
        ]);

        if (!departmentDetails || departmentDetails.length === 0) {
            throw new ApiError(404, "No departments found");
        }

        res.status(200).json(new ApiResponse(200, departmentDetails, "Departments fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to fetch all departments");
    }
});

const updateDepartment = asyncHandler(async (req, res) => {
    const { departmentId } = req.params
    const { name, description, course_id } = req.body;

    if (!departmentId) {
        throw new ApiError(400, " Invalid department id")
    }

    if (![name].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    const department = await Department.findByIdAndUpdate(
        departmentId,
        {
            $set: {
                name: name,
                description: description,
                course_id: course_id
            },
        },
        { new: true }

    );

    if (!department) {
        throw new ApiError(500, "Failed to update department details. please try again!!");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            department,
            "department details updated successfully"
        ))
})

const deleteDepartment = asyncHandler(async (req, res) => {
    const { departmentId } = req.params

    if (!isValidObjectId(departmentId)) {
        throw new ApiError(400, "Invalid department id");
    }

    const department = await Department.findById(departmentId);

    if (!department) {
        throw new ApiError(404, "No department found");
    }

    const departmentDeleted = await Department.findByIdAndDelete(department?._id);

    if (!departmentDeleted) {
        throw new ApiError(400, "Failed to delete the department. please try again!!");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "department deleted successfully"
        ))
})



export {
    registerDepartment,
    getAllDepartments,
    updateDepartment,
    deleteDepartment
}