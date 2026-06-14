"use client";
import MainLayout from "@/components/layout/MainLayout";
import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const timelineData = [
  {
    id: 1,
    title: "Planning",
    date: "Jan 2024",
    content: "Project planning and requirements gathering phase.",
    category: "Planning",
    icon: Calendar,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Design",
    date: "Feb 2024",
    content: "UI/UX design and system architecture.",
    category: "Design",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Development",
    date: "Mar 2024",
    content: "Core features implementation and testing.",
    category: "Development",
    icon: Code,
    relatedIds: [2, 4],
    status: "in-progress" as const,
    energy: 60,
  },
  {
    id: 4,
    title: "Testing",
    date: "Apr 2024",
    content: "User testing and bug fixes.",
    category: "Testing",
    icon: User,
    relatedIds: [3, 5],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 5,
    title: "Release",
    date: "May 2024",
    content: "Final deployment and release.",
    category: "Release",
    icon: Clock,
    relatedIds: [4],
    status: "pending" as const,
    energy: 10,
  },
];

export default function FeaturesPage() {
  return (
    <MainLayout>
      <div className="h-full w-full overflow-hidden flex flex-col">
        <div className="shrink-0 p-5 border-b border-border/50 bg-background/50 backdrop-blur-sm z-10">
          <h1 className="text-xl font-semibold tracking-tight">Project Features</h1>
          <p className="text-sm text-muted-foreground mt-1">Interactive timeline of our roadmap and feature development.</p>
        </div>
        <div className="flex-1 relative -mt-16">
          <RadialOrbitalTimeline timelineData={timelineData} />
        </div>
      </div>
    </MainLayout>
  );
}
