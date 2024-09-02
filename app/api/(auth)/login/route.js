import connect from "@/lib/db";
import User from "@/lib/modals/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    try {
        const { email, password } = await request.json();

        await connect();

        const user = await User.findOne({ email });
        if (!user) {
            return new NextResponse(JSON.stringify({ msg: "Invalid Email or Password" }), { status: 401 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return new NextResponse(JSON.stringify({ msg: "Invalid Email or Password" }), { status: 401 });
        }

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return new NextResponse(JSON.stringify({ token }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
};
