import { useEffect } from "react";
import { TeamList } from "../components/teams/TeamList";
import { MainLayout } from "../components/layout/MainLayout";
import { motion } from "framer-motion";

export function TeamsPage() {
  // Senior Touch: Update the document title for browser tabs
  useEffect(() => {
    document.title = "Teams | TaskPilot";
  }, []);

  return (
    <MainLayout
      title="Team Workspaces"
      subtitle="Manage your collaborative environments and member permissions."
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <TeamList />
      </motion.div>
    </MainLayout>
  );
}
