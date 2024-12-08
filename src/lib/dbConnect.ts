import mongoose from "mongoose";

type ConnectObject = {
    isConnected?: number;
}

const connection: ConnectObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to database ");
        return;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "", {});

        connection.isConnected = db.connections[0].readyState
        console.log("Connected to database");
    } catch (error) {
        console.log("Database connection failed: ", error);
        
        process.exit(1);
    }
}

export default dbConnect;