import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../model/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

// Initialize Inngest client
export const inngest = new Inngest({ id: "Talentrox" });

const syncUser = inngest.createFunction(
  { id: "sync/user" },
  [{ event: "clerk/user.created" }, { event: "clerk/user.updated" }],
  async ({ event }) => {
    await connectDB();
    const { id, first_name, last_name, email_addresses, image_url } = event.data || {};
    if (!id) return;

    const userData = {
      clerkId: id,
      name: `${first_name || ""} ${last_name || ""}`.trim() || "Anonymous User",
      email: email_addresses?.[0]?.email_address || "",
      imageUrl: image_url || "",
    };

    await User.findOneAndUpdate(
      { clerkId: id },
      userData,
      { upsert: true, new: true }
    );

    await upsertStreamUser({
      id: userData.clerkId,
      name: userData.name,
      image: userData.imageUrl,
    });
  }
);

const deleteUser = inngest.createFunction(
  { id: "delete/user" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data || {};
    if (!id) return;

    await User.deleteOne({ clerkId: id });
    await deleteStreamUser(id.toString());
  }
);

export const functions = [syncUser, deleteUser];

