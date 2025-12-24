import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActiveSessions from "../components/ActiveSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import RecentSessions from "../components/RecentSessions";
import StatsCards from "../components/StatsCards";
import WelcomeSection from "../components/WelcomeSection";
import {
  useCreateSession,
  useGetActiveSessions,
  useMyRecentSessions,
} from "../hooks/useSessions";
function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [onCreateModal, setOnCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  const createSessionMutation = useCreateSession();
  const { data: activeSessionsData, isLoading: isGetActiveSessionsLoading } =
    useGetActiveSessions();
  const { data: recentSessionsData, isLoading: isMyRecentSessionsLoading } =
    useMyRecentSessions();
  const recentSessions = recentSessionsData?.sessions || [];
  const activeSessions = activeSessionsData?.sessions || [];

  const handleCreateRoom = () => {
    if (roomConfig.problem === "" || roomConfig.difficulty === "") {
      alert("Please select both problem and difficulty level.");
      return;
    }
    createSessionMutation.mutate(
      // Payload
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      // Options
      {
        onSuccess: (data) => {
          setOnCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  // Check if current user is in session as participant or host and return boolean
  const isUserInSession = (session) => {
    if (!user) return false; // User is not logged in
    return (
      session.participant?.clerkId === user.id ||
      session.host?.clerkId === user.id
    );
  };
  return (
    <>
      <div className="min-h-screen bg-base-300">
        <div className="pt-20">
          <WelcomeSection onCreateSession={() => setOnCreateModal(true)} />
          {/* Grid layout */}
          <div className="container mx-auto px-6 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <StatsCards
                activeSessionsCount={activeSessions.length}
                recentSessionsCount={recentSessions.length}
              />

              <ActiveSessions
                sessions={activeSessions}
                isLoading={isGetActiveSessionsLoading}
                isUserInSession={isUserInSession}
              />
            </div>

            <RecentSessions
              sessions={recentSessions}
              isLoading={isMyRecentSessionsLoading}
            />
          </div>
        </div>
      </div>

      <CreateSessionModal
        isOpen={onCreateModal}
        onClose={() => {
          setOnCreateModal(false);
        }}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;
