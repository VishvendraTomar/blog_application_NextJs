import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";


export const config = {
    matcher: ["/api/:path*"],
};

export default function middleware(request){
    const authResult = authMiddleware(request)

    if(!authResult.isValid  ){
        return new NextResponse(JSON.stringify({message:"unauthorized"}),{ status: 401 })
    }
    return NextResponse.next()
}