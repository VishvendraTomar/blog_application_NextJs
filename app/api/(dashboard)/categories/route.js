import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // Validate userId
        if (!userId || !Types.ObjectId.isValid(userId)) {
            return new NextResponse("Invalid user ID", { status: 400 });
        }

        await connect();

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const categories = await Category.find({ user: userId });
        return new NextResponse(JSON.stringify(categories), { status: 200 });
    } catch (err) {
        console.error("Error in fetching categories: ", err);
        return new NextResponse("Error in fetching categories: " + err.message, { status: 500 });
    }
};


export const POST = async (request) => {
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");
        
        const {title} = await request.json();

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse("Invalid user ID", { status: 400 });
        }
        await connect();
        const user = await User.findById(userId);

        if(!user){
            return new NextResponse("User not found", { status: 404 });
        }
        const newCategory  = new Category({
            title,
            user: userId
        });
        await newCategory.save();
        return new NextResponse(JSON.stringify({message: "Category created", category: newCategory}),{ status: 200 })

} catch (err) {
    console.error("Error in creating categories: ", err);
    return new NextResponse("Error in creating categories: " + err.message, { status: 500 });
}
}