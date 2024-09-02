import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/api/logMiddleware";


export const config = {
    matcher: ["/users/:path*"],
};


export default function middleware(request){
    if(request.url.includes("/api/blogs")){
        const result = logMiddleware(request)
        console.log(result.Response)
    }
    const authResult = authMiddleware(request)

    if(!authResult.isValid  ){
        return new NextResponse(JSON.stringify({message:"unauthorized"}),{ status: 401 })
    }
    return NextResponse.next()
}