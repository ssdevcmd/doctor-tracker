import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("doctor_tracker_db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
        cookieCache: {
            enabled: true,
            strategy: 'jwt',
            //max 7 days
            maxAge: 7 * 24 * 60 * 60
        }
    },
    plugins: [
        jwt()
    ]
});