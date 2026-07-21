// import mongoose from "mongoose";

// const connectDB = async () => {
//   if (!process.env.MONGO_URI) {
//     console.error("MONGO_URI is not defined in environment variables");
//     return false;
//   }

//   try {
//     console.log("Connecting to MongoDB...");

//     await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000,
//       family: 4,
//     });

//     console.log("MongoDB Connected");
//     return true;
//   } catch (err) {
//     console.error("MongoDB connection error:", err.message);
//     return false;
//   }
// };

// export default connectDB;



// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     console.log("Connecting to MongoDB...");

//     await mongoose.connect(process.env.MONGO_URI, {
//       serverSelectionTimeoutMS: 10000,
//     });

//     console.log("✅ MongoDB Connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//   }
// };

// export default connectDB;



// import mongoose from "mongoose";
// // mongoose.set("strictQuery", true);

// // await mongoose.connect(process.env.MONGO_URI,{
// //     serverSelectionTimeoutMS:15000,
// //     family:4
// // });

// const connectDB = async () => {
//   try {
//     console.log("Connecting to MongoDB...");
//     console.log(process.env.MONGO_URI);

//     const conn = await mongoose.connect(process.env.MONGO_URI);

//     console.log("✅ MongoDB Connected");
//     console.log("Host:", conn.connection.host);
//     console.log("Database:", conn.connection.name);
//   } catch (err) {
//     console.error("❌ Mongo Error");
//     console.error(err);
//     process.exit(1);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    console.log("Connecting to MongoDB...");
    console.log(process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      family: 4,
    });

    console.log("✅ MongoDB Connected");
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);
  } catch (err) {
    console.error("❌ Mongo Error");
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;