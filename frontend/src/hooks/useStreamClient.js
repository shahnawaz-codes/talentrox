import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient } from "../lib/stream";
import { generateToken } from "../api/sessionApi";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  // Track whether the current user is authorised to be in this call.
  // We wait until the join mutation has finished, so isParticipant may
  // start false and flip to true shortly after mount — hence the effect
  // dependency on both flags.

  const canJoin = isHost || isParticipant;

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;
    let videoClientInstance = null;
    const isCancelledRef = { current: false };

    const initCall = async () => {
      if (!session?.callId) {
        setIsInitializingCall(false);
        return;
      }
      // Not yet authorised — wait for the join mutation to complete.
      // The effect will re-run once isParticipant flips to true.
      if (!canJoin) {
        setIsInitializingCall(true); // keep spinner visible
        return;
      }
      if (session.status === "completed") {
        setIsInitializingCall(false);
        return;
      }

      try {
        const { token, user } = await generateToken();

        if (isCancelledRef.current) return;

        const { userId, userName, userImage } = user;

        // Always create a fresh client — never reuse a cached one.
        videoClientInstance = initializeStreamClient(
          { id: userId, name: userName, image: userImage },
          token,
        );
        if (isCancelledRef.current) {
          await videoClientInstance.disconnectUser();
          return;
        }
        setStreamClient(videoClientInstance);

        videoCall = videoClientInstance.call("default", session.callId);
        await videoCall.join({ create: true });
        if (isCancelledRef.current) {
          await videoCall.leave();
          return;
        }
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);
        await chatClientInstance.connectUser(
          { id: userId, name: userName, image: userImage },
          token,
        );
        if (isCancelledRef.current) {
          await chatClientInstance.disconnectUser();
          return;
        }
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel(
          "messaging",
          session.callId,
        );
        await chatChannel.watch();
        if (!isCancelledRef.current) {
          setChannel(chatChannel);
        }
      } catch (error) {
        if (!isCancelledRef.current) {
          toast.error("Failed to join video call");
          console.error("Error init call", error);
        }
      } finally {
        if (!isCancelledRef.current) {
          setIsInitializingCall(false);
        }
      }
    };

    if (session && !loadingSession) initCall();

    return () => {
      isCancelledRef.current = true;
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          // Disconnect the video client we created (no global singleton).
          if (videoClientInstance) await videoClientInstance.disconnectUser();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
    // Re-run when canJoin changes — this is the key fix for the race condition.
  }, [session, loadingSession, canJoin]);

  return { streamClient, call, chatClient, channel, isInitializingCall };
}

export default useStreamClient;
