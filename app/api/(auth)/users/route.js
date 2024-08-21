import connect from "@/lib/db"
import User from "@/lib/modals/user"
import { NextResponse } from "next/server"
import { Types } from "mongoose"
const ObjectId = require("mongoose").Types.ObjectId;


// GET (read) all users
export const GET = async () =>{
    try{
        await connect()
        const users = await User.find()
        return new NextResponse(JSON.stringify(users),{ status: 200 })
    }catch(error){
        return new NextResponse("Error in fetching user information"+error, { status: 500 }) 
    }
}


// POST (create) a new user
export const POST = async (request) =>{
    try{
        const body = await request.json()
        await connect()
        const newUser = new User(body)
        await newUser.save()
        return new NextResponse(JSON.stringify({message : "new user created",user:newUser}),{ status: 200 })
    }catch(error){
        return new NextResponse(JSON.stringify({error}),{ status: 500 })
    }
}  

// PATCH (update) a user
export const PATCH = async (request) => {
    try {
      const body = await request.json();
      await connect();
      const updatedUser = await User.findByIdAndUpdate(body._id, body, { new: true });
      return new NextResponse(JSON.stringify({ message: "user updated", user: updatedUser }), { status: 200 });
    } catch (error) {
      return new NextResponse(JSON.stringify({ error }), { status: 500 });
    }
  };
  

  // DELETE (delete) a user
  export const DELETE = async (request) => {
    try {
      const id = request.nextUrl.searchParams.get("id");
      
      // Check if the ID is a valid ObjectId
      if (!Types.ObjectId.isValid(id)) {
        return new NextResponse("Invalid user ID", { status: 400 });
      }
  
      await connect();
      const deletedUser = await User.findByIdAndDelete(id);
      
      if (!deletedUser) {
        return new NextResponse("User not found", { status: 404 });
      }
  
      return new NextResponse(JSON.stringify({ message: "User deleted", user: deletedUser }), { status: 200 });
    } catch (error) {
      return new NextResponse("Error in deleting user: " + error, { status: 500 });
    }
  };