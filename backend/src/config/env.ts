import dotenv from "dotenv";

console.log("NODE_ENV:", process.env.NODE_ENV);

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env.local" });
}
