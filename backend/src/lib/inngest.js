import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../model/User.js";
import { upsertStreamUser } from "./stream.js";

// Initialize Inngest client
export const inngest = new Inngest({ id: "Talentrox" });

const syncUser = inngest.createFunction(
  // Function ID
  { id: "sync/user" },
  // Trigger on Clerk user creation event
  { event: "clerk/user.created" },
  async ({ event }) => {
    // Ensure DB connection
    await connectDB();
    // Extract user data from event payload and create new user in DB
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const newUser = {
      clerkId: id,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses[0]?.email_address || "",
      imageUrl: image_url || "",
    };
    await User.create(newUser);
    // Also upsert user in Stream
    await upsertStreamUser({
      id: id.toString(), // Clerk ID
      name: newUser.name,
      image: newUser.imageUrl,
    });
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
    await deleteStreamUser(id.toString());
  }
);
export const functions = [syncUser, deleteUser];
