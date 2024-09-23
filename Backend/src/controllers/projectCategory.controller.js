import { asyncHandler } from "../utils/asyncHandler.js"; //  asyncHandler utility for handling asynchronous operations
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Department } from "../models/department.model.js";
import { ProjectCategory } from "../models/projectCategory.model.js";

const registerProjectCategory = asyncHandler(async (req, res) => {
    // get Project category details from frontend
    // validation - not empty
    // craete Project category object - create entry in db
    // check for Project category creation
    // return response

    // Get Project category details from the request body
    const { name, description} = req.body
    console.log('Project category Name', name)

    // Validate that all required fields are present and not empty
    if (![name].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if Project category already exists
    const existedProjectCategory = await ProjectCategory.findOne({
        $or: [{ name }]
    })

    if (existedProjectCategory) {
        throw new ApiError(409, "Project category already exists")
    }

    // Create a new Project category in the database
    const projectCategory = await ProjectCategory.create({
        name,
        description,
    });

    // Fetch the created Project category from the database
    const createdProjectCategory = await ProjectCategory.findById(projectCategory._id);


    if (!createdProjectCategory) {
        throw new ApiError(500, "Something went wrong while inserting the Project category into the database")
    }

    // Return success response with the registered Project category details
    return res.status(200).json(
        new ApiResponse(200, createdProjectCategory, "Project category Details inserted Successfully")
    )
})


const getAllProjectCategories = asyncHandler(async (req, res) => {
    try {
        const projectCategory = await ProjectCategory.find();
        if (!projectCategory || projectCategory.length === 0) {
            throw new ApiError(404, "No project category found");
        }
        return res.status(200).json(
            new ApiResponse(
                200,
                projectCategory,
                "All Project category fetched successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to fetch all project categories");
    }
});

const updateProjectCategory = asyncHandler(async (req, res) => {
    const { projectCategoryId } = req.params
    const { name, description } = req.body;

    if (!projectCategoryId) {
        throw new ApiError(400, " Invalid project category id")
    }

    if (![name].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    const projectCategory = await ProjectCategory.findByIdAndUpdate(
        projectCategoryId,
        { 
            $set: { 
                name: name,
                description: description,
            },
         },
        { new: true }

    );

    if (!projectCategory) {
        throw new ApiError(500, "Failed to update project category details. please try again!!");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            projectCategory,
            "Project category details updated successfully"
        ))
})

const deleteProjectCategory = asyncHandler(async (req, res) => {
    const { projectCategoryId } = req.params

    if (!isValidObjectId(projectCategoryId)) {
        throw new ApiError(400, "Invalid project category id");
    }

    const projectCategory = await ProjectCategory.findById(projectCategoryId);

    if (!projectCategory) {
        throw new ApiError(404, "No project category found");
    }

    const projectCategoryDeleted = await ProjectCategory.findByIdAndDelete(projectCategory?._id);

    if (!projectCategoryDeleted) {
        throw new ApiError(400, "Failed to delete the project category. please try again!!");
    }

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Project Category deleted successfully"
        ))
})



export {
    registerProjectCategory,
    getAllProjectCategories,
    updateProjectCategory,
    deleteProjectCategory
}