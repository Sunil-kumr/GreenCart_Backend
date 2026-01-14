import cookieParser from "cookie-parser";
import express from "express";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const port = process.env.PORT || 5000;

/* =========================
   MANUAL CORS (FINAL)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://green-cart-frontend-a1h16xy1r-sunil-kumrs-projects.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* =========================
   STRIPE WEBHOOK (RAW)
========================= */
app.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

/* =========================
   BODY & COOKIES
========================= */
app.use(express.json());
app.use(cookieParser());

/* =========================
   DB & CLOUDINARY
========================= */
await connectDB();
await connectCloudinary();

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => res.send("API is Working"));
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
