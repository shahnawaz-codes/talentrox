import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { generateToken } from "../api/sessionApi";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);

  useEffect(() => {
    let videoCall = null;
    let chatClientInstance = null;
    const isCancelledRef = { current: false };

    const initCall = async () => {
      if (!session?.callId) {
        setIsInitializingCall(false);
        return;
      }
      if (!isHost && !isParticipant) {
        setIsInitializingCall(false);
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
        if (process.env.NODE_ENV === 'development') {
          console.log("Stream Data:", { userId });
        }
        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );
        if (isCancelledRef.current) {
          // Clean up if cancelled
          await client.disconnectUser();
          return;
        }

        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
        if (isCancelledRef.current) {
          // Clean up if cancelled
          await videoCall.leave();
          return;
        }
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );
        if (isCancelledRef.current) {
          // Clean up if cancelled
          await chatClientInstance.disconnectUser();
          return;
        }
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel(
          "messaging",
          session.callId,
        );
        await chatChannel.watch();
        if (isCancelledRef.current) {
          // Clean up if cancelled - channel already watched, will be cleaned up in main cleanup
          return;
        }
        setChannel(chatChannel);
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

    // cleanup - performance reasons
    return () => {
      isCancelledRef.current = true;
      // iife
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;