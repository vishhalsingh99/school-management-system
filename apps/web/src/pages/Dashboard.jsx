import { useEffect, useState } from "react";
import api from "../services/api";

import StatCard from "../components/dashboard/StatCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentActivities from "../components/dashboard/RecentActivities";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    classes: 0,
    sections: 0,
    students: 0,
    teachers: 0,
    year: "",
  });
  const [recentStudents, setRecentStudents] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const [classes, students, teachers, year] = await Promise.all([
        api.get("/classes/list"),
        api.get("/students/list"),
        api.get("/teachers/list"),
        api.get("/academic-years/current"),
      ]);

      const classList = classes.data.data || classes.data || [];
      const studentList = students.data.data || students.data || [];
      const teacherList = teachers.data.data || teachers.data || [];

      console.log(`classes:`, classList);
      console.log(`students:`, studentList);
      console.log(`teachers:`, teacherList);

      setStats({
        classes: classList.length,
        students: studentList.length,
        teachers: teacherList.length,
        year: year.data.data?.name || "Not Set",
      });

      setRecentStudents(studentList.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Academic Year: <b>{stats.year}</b>
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Classes" value={stats.classes} icon="📚" color="from-blue-500 to-blue-600" />
        <StatCard title="Students" value={stats.students} icon="👥" color="from-purple-500 to-purple-600" />
        <StatCard title="Teachers" value={stats.teachers} icon="👨‍🏫" color="from-orange-500 to-orange-600" />
      </div>

      {/* QUICK ACTIONS */}
      <QuickActions />

      {/* RECENT */}
      <RecentActivities students={recentStudents} />
    </div>
  );
}
