import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../model/User.js";

// Initialize Inngest client
export const inngest = new Inngest({ id: "Talentrox" });
//
const syncUser = inngest.createFunction(
  { id: "sync/user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    // Ensure DB connection
    await connectDB();
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const newUser = {
      clerkId: id,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses[0]?.email_address || "",
      imageUrl: image_url || "",
    };
    await User.create(newUser);
  }
);
const deleteUser = inngest.createFunction(
  { id: "delete/user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    // Ensure DB connection
    await connectDB();
    const { id } = event.data;

    await User.deleteOne({ clerkId: id });
  }
);
export const functions = [syncUser, deleteUser];
