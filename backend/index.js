// require("dotenv").config()
// const express=require('express')
// const cors=require('cors')
// const morgan=require("morgan")
// const cookieParser=require("cookie-parser")
// const authRoutes=require("./routes/Auth")
// const productRoutes=require("./routes/Product")
// const orderRoutes=require("./routes/Order")
// const cartRoutes=require("./routes/Cart")
// const brandRoutes=require("./routes/Brand")
// const categoryRoutes=require("./routes/Category")
// const userRoutes=require("./routes/User")
// const addressRoutes=require('./routes/Address')
// const reviewRoutes=require("./routes/Review")
// const wishlistRoutes=require("./routes/Wishlist")
// const { connectToDB } = require("./database/db")


// // server init
// const server=express()

// // database connection
// connectToDB()


// // middlewares
// server.use(cors({origin:process.env.ORIGIN,credentials:true,exposedHeaders:['X-Total-Count'],methods:['GET','POST','PATCH','DELETE']}))
// server.use(express.json())
// server.use(cookieParser())
// server.use(morgan("tiny"))

// // routeMiddleware
// server.use("/auth",authRoutes)
// server.use("/users",userRoutes)
// server.use("/products",productRoutes)
// server.use("/orders",orderRoutes)
// server.use("/cart",cartRoutes)
// server.use("/brands",brandRoutes)
// server.use("/categories",categoryRoutes)
// server.use("/address",addressRoutes)
// server.use("/reviews",reviewRoutes)
// server.use("/wishlist",wishlistRoutes)



// server.get("/",(req,res)=>{
//     res.status(200).json({message:'running'})
// })


// server.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


// server.listen(8000, '0.0.0.0',()=>{
//     console.log('server [STARTED] ~ http://localhost:8000');
// })

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

// Routes
const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/Order");
const cartRoutes = require("./routes/Cart");
const brandRoutes = require("./routes/Brand");
const categoryRoutes = require("./routes/Category");
const userRoutes = require("./routes/User");
const addressRoutes = require("./routes/Address");
const reviewRoutes = require("./routes/Review");
const wishlistRoutes = require("./routes/Wishlist");

const { connectToDB } = require("./database/db");

// Create server
const server = express();

// Database connection
connectToDB();

// Middleware
server.use(
  cors({
    origin: process.env.ORIGIN || "*", // Allow all origins if not specified
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
server.use(express.json());
server.use(cookieParser());
server.use(morgan("tiny"));

// Routes
server.use("/auth", authRoutes);
server.use("/users", userRoutes);
server.use("/products", productRoutes);
server.use("/orders", orderRoutes);
server.use("/cart", cartRoutes);
server.use("/brands", brandRoutes);
server.use("/categories", categoryRoutes);
server.use("/address", addressRoutes);
server.use("/reviews", reviewRoutes);
server.use("/wishlist", wishlistRoutes);

// Health route (for testing)
server.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running fine!" });
});

// ----------------------------
// Deployment: Serve Frontend
// ----------------------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  server.use(express.static(path.join(__dirname1, "../frontend/build")));
  server.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "../frontend/build", "index.html"))
  );
}

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server started on port ${PORT}`);
});

