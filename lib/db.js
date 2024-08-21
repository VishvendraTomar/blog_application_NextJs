 import mongoose, { mongo } from "mongoose";

 const MONGODB_URI = process.env.MONGODB_URI;

 const connect = async () => {
    const connectionState = mongoose.connect.readyState;

    if(connectionState === 1){
        console.log("already connected ")
        return 
    }
    if(connectionState === 2){
        console.log("connecting ...")
        return 
    }

    try{
        await mongoose.connect(MONGODB_URI, {
            dbName: "nextfirstapi",
            bufferCommands: true
        })
        console.log("connected")
    }catch(err){
        console.log("error",err)
        throw new Error("error",err)
    }
 }

 export default connect;