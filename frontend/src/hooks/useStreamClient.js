import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { generateToken } from "../api/sessionApi";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null); // Store the StreamVideoClient instance
  const [call, setCall] = useState(null); // Store the current call instance
  const [chatClient, setChatClient] = useState(null); // Store the StreamChat client instance
  const [channel, setChannel] = useState(null); // Store the chat channel instance
  const [isInitializingCall, setIsInitializingCall] = useState(true); // Track if we're in the process of initializing the call

  useEffect(() => {
    let isCancelled = false;
    let videoCall = null;
    let chatClientInstance = null;
    const isCancelledRef = { current: false };

    const initCall = async () => {
      /**
       * Only initialize the Stream client and join the call if:
       * 1. We have a valid callId from the session
       * 2. The user is either the host or the participant of the session
       * 3. The session is not completed
       */
      const canInitialize =
        Boolean(session?.callId) &&
        (isHost || isParticipant) &&
        session?.status !== "completed";

      if (!canInitialize) {
        setStreamClient(null);
        setCall(null);
        setChatClient(null);
        setChannel(null);
        setIsInitializingCall(false);
        return;
      }
      /**
       * If we can initialize, set the initializing state to true and proceed with setting up the Stream client, joining the call, and connecting to chat.
       * We also set up cleanup logic to leave the call and disconnect from chat when the component unmounts or when dependencies change.
       */
      setIsInitializingCall(true);
      setStreamClient(null);
      setCall(null);
      setChatClient(null);
      setChannel(null);
      try {
        const { token, user } = await generateToken();
        if (isCancelledRef.current) return;

        const { userId, userName, userImage } = user;
        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token,
        );
        if (isCancelled) return;
        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });

        if (isCancelled) return;
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
        if (isCancelled) return;

        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel(
          "messaging",
          session.callId,
        );
        await chatChannel.watch();
        if (isCancelled) return;
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
      isCancelled = true;

      // iife
      (async () => {
        const cleanupTasks = [
          {
            name: "videoCall.leave",
            run: async () => {
              if (videoCall) await videoCall.leave();
            },
          },
          {
            name: "chatClientInstance.disconnectUser",
            run: async () => {
              if (chatClientInstance) await chatClientInstance.disconnectUser();
            },
          },
          {
            name: "disconnectStreamClient",
            run: async () => {
              await disconnectStreamClient();
            },
          },
        ];

        const results = await Promise.allSettled(
          cleanupTasks.map((task) => task.run()),
        );

        results.forEach((result, idx) => {
          if (result.status === "rejected") {
            console.error(
              `Cleanup operation ${cleanupTasks[idx].name} failed:`,
              result.reason,
            );
          }
        });
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