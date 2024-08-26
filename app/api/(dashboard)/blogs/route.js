import { NextResponse } from "next/server";
import  connect  from "@/lib/db";
import User from "@/lib/modals/user";
import Blog from "@/lib/modals/blog";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const categoryId = searchParams.get("categoryId");
  const searchKeyword = searchParams.get("keywords");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const page = searchParams.get("page"|| "1");
  const limit = searchParams.get("limit"||"10");


  try {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user ID", { status: 400 });
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid category ID", { status: 400 });
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

    const filter = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    if(searchKeyword){
        filter.$or = [
            { title: { $regex: searchKeyword, $options: "i" } },
            { description: { $regex: searchKeyword, $options: "i" } },
        ]
    }

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    }else if(endDate){
      filter.createdAt = { $lte: new Date(endDate) };
    }

    const skip = (page-1)* limit;
    
    const blogs = await Blog.find(filter).sort({createdAt:"asc"}).skip(skip).limit(limit);

    
    return new NextResponse(JSON.stringify(blogs), { status: 200 });
  } catch (err) {
    console.error("Error in fetching blogs: ", err);
    return new NextResponse("Error in fetching blogs: " + err.message, { status: 500 });
  }
};


export const POST = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const { title, description } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse("Invalid user ID", { status: 400 });
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse("Invalid category ID", { status: 400 });
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

    const newBlog = new Blog({
      title,
      description,
      user: userId,
      category: categoryId
    });
    await newBlog.save();
    return new NextResponse(JSON.stringify(newBlog), { status: 200 });
  } catch (error) {
    console.error("Error in creating blog: ", error);
    return new NextResponse("Error in creating blog: " + error.message, { status: 500 });
  }
}