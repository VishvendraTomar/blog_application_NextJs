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
    try {
       
    } catch (err) {
        console.error("Error in fetching blogs: ", err);
        return new NextResponse("Error in fetching blogs: " + err.message, { status: 500 });
    }
}