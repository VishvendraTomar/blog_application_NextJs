import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import User from "@/lib/modals/user";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";


export const GET  = async (request) => {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");

    if (!userId || !Types.ObjectId.isValid(userId)) {
        return new NextResponse("Invalid user ID", { status: 400 });
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        return new NextResponse("Invalid category ID", { status: 400 });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
        return new NextResponse("Category not found", { status: 404 });
    }
    try {
       
    } catch (err) {
        console.error("Error in fetching blogs: ", err);
        return new NextResponse("Error in fetching blogs: " + err.message, { status: 500 });
    }
}