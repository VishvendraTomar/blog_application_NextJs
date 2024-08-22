import connect from "@/lib/db";
import {connectToDatabase} from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";


export const PATCH = async (request, { params }) => {
    const categoryId = params.category;
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

        const category = await Category.findById(categoryId);
        if (!category) {
            return new NextResponse("Category not found", { status: 404 });
        }

        // Parse the request body
        const { title } = await request.json();

        if (!title) {
            return new NextResponse("Title is required", { status: 400 });
        }

        // Update the category
        category.title = title;
        await category.save();

        return new NextResponse(JSON.stringify({ message: "Category updated", category }), { status: 200 });
    } catch (error) {
        console.error("Error in updating category: ", error);
        return new NextResponse("Error in updating category: " + error.message, { status: 500 });
    }
};



export async function DELETE(request, { params }) {
    try {
      await connect();
      const {searchParams} = new URL(request.url);
      const  userId  = searchParams.get("userId")
      const categoryId = params.category;
  
      const category = await Category.findOneAndDelete({ _id: categoryId, user: userId });
  
      if (!category) {
        return new Response(JSON.stringify({ error: "Category not found or not authorized" }), { status: 404 });
      }
  
      return new Response(JSON.stringify({ message: "Category deleted successfully" }), { status: 200 });
    } catch (error) {
      console.error("Error in deleting category: ", error);
      return new Response(JSON.stringify({ error: "Error in deleting category" }), { status: 500 });
    }
  }