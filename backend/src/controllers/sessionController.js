import { chatClient, streamClient } from "../lib/stream.js";
import { Session } from "../model/Session.js";

export const createSession = async (req, res, next) => {
  try {
    const { problem, difficulty } = req.body;
    const { _id, clerkId } = req.user;
    //generate call id for stream call
    const callId = `session-${Date.now()}-${Math.random()
      .toString(36)
      .substring(0, 8)}`;
    //check if problem and difficulty are provided
    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and difficulty are required!!" });
    }
    //create session
    const session = await Session.create({
      problem,
      difficulty,
      host: _id,
      callId,
    });
    //create stream call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });
    // create stream chat
    chatClient
      .channel("messaging", callId, {
        name: `${problem} session`,
        members: [clerkId],
        created_by_id: clerkId,
      })
      .create();
    res.status(201).json({ session });
  } catch (error) {
    console.error("Error creating session:", error);
    next(error);
  }
};

export const getActiveSessions = async (_, res, next) => {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name imageUrl clerkId email")
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error getting active sessions:", error);
    next(error);
  }
};
export const getMyRecentSessions = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: _id }, { participants: _id }],
    })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error getting my recent sessions:", error);
    next(error);
  }
};
export const getSessionById = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId)
      .populate("host", "name imageUrl clerkId email")
      .populate("participants", "name imageUrl email");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error getting session by id:", error);
    next(error);
  }
};
export const joinSessionById = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { _id, clerkId } = req.user;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    //check if session is full
    if (session.participants)
      return res.status(400).json({ message: "session is full" });
    session.participants = _id;
    await session.save();
    // add user to stream
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error joining session by id:", error);
    next(error);
  }
};
export const endSessionById = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { _id, clerkId } = req.user;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    //check if session is active
    if (session.status === "completed")
      return res.status(400).json({ message: "Session is already completed" });
    if (session.host.toString() !== _id.toString())
      return res
        .status(403)
        .json({ message: "You are not the host of this session" });
    session.status = "completed";
    await session.save();
    // remove user and end call from stream chat
    const channel = await chatClient.channel("messaging", session.callId);
    await channel.removeMembers([clerkId]);
    await channel.delete();
    // end call from stream
    const call = await streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });
    res.status(200).json({ session });
  } catch (error) {
    console.error("Error ending session by id:", error);
    next(error);
  }
};
