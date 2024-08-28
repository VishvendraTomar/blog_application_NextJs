

const validate = (token)=>{
    const validToken = true 
     if(!validToken || !token){
        return false
     }
     else return true
}

export function authMiddleware(req) {

    const token = req.headers.get("Authorization")?.split(" ")[1];

    return {isValid:validate(token)}

}

