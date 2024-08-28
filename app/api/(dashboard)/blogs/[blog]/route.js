import { NextResponse } from "next/server";
import  connect  from "@/lib/db";
import User from "@/lib/modals/user";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";



export const GET = async (request, { params }) => {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const blogId = params.blog;
    try {
    if (!userId || !Types.ObjectId.isValid(userId)) {
        return new NextResponse("Invalid user ID", { status: 400 });
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        return new NextResponse("Invalid category ID", { status: 400 });
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
        return new NextResponse("Invalid blog ID", { status: 400 });
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        return new NextResponse("Category not found", { status: 404 });
    }


    const blog = await Blog.findOne({ _id: blogId, user: userId, category: categoryId });
    if (!blog) {
        return new NextResponse("Blog not found", { status: 404 });
    }

        return new NextResponse(JSON.stringify(blog), { status: 200 });

    } catch (err) { 
        console.error("Error in getting blog: ", err);
        return new NextResponse("Error in getting blog", { status: 500 });
    }
} 



export const PATCH = async (request, { params }) => {
    const blogId = params.blog;

    try {
        // Validate blogId
        if (!blogId || !Types.ObjectId.isValid(blogId)) {
            return new NextResponse("Invalid blog ID", { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // Validate userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid user ID", { status: 400 });
        }

        // Connect to database
        await connect();

        // Verify the user exists
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Find the blog post
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return new NextResponse("Blog not found", { status: 404 });
        }

        // Parse the request body
        const { title, description } = await request.json();

        // Validate title
        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        // Update the blog post
        blog.title = title;
        blog.description = description || blog.description; // Keep original description if not provided

        // Save the updated blog post
        await blog.save();

        return new NextResponse("Blog updated successfully", { status: 200 });

    } catch (err) {
        console.error("Error in updating blog: ", err);
        return new NextResponse("Error in updating blog: " + err.message, { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    const blogId = params.blog;

    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid user ID", { status: 400 });
        }

        
        await connect();
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const blog = await Blog.findOneAndDelete({ _id: blogId, user: userId });
        if (!blog) {
            return new NextResponse("Blog not found", { status: 404 });
        }

        return new NextResponse("Blog deleted successfully", { status: 200 });
    } catch (err) {
        console.error("Error in deleting blog: ", err);
        return new NextResponse("Error in deleting blog: " + err.message, { status: 500 });
    }
};
