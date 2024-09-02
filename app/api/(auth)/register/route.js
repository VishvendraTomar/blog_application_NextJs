import connect from "@/lib/db";
import User from "@/lib/modals/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        const { name, email, password, isAdmin, userType } = await request.json();
        console.log({ name, email, password, isAdmin, userType }); 

        await connect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new NextResponse(JSON.stringify({ msg: "User Already Registered" }), { status: 400 });
        }

        const finalIsAdmin = isAdmin !== undefined ? isAdmin : false; 
        const finalUserType = userType !== undefined ? userType : 'viewer'; 

        const resolvedUserType = finalIsAdmin ? 'admin' : finalUserType;

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            userType: resolvedUserType, 
            isAdmin: finalIsAdmin 
        });

        console.log( newUser); 


        await newUser.save();

        return new NextResponse(JSON.stringify({ msg: "User Registration Successful" }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
