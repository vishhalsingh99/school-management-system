import express from "express";
const router = express.Router();

import studentsRoutes from "./modules/students/students.routes.js";
import classesRoutes from "./modules/classes/classes.routes.js";
import sectionsRoutes from "./modules/sections/sections.routes.js";
import teachersRoutes from "./modules/teachers/teachers.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";
import examsRoutes from "./modules/exams/exams.routes.js";
import setupRoutes from "./modules/setup/setup.routes.js";
import academicYearRoutes from "./modules/academicYears/academicYears.routes.js";
import subjectsRoutes from "./modules/subjects/subjects.routes.js";
import teacherAssignments from "./modules/teacherAssignment/teacherAssignments.routes.js";
import studentAcademics from "./modules/studentAcademics/studentAcademics.routes.js";
import studentSubjectEnrollments from "./modules/studentSubjectEnrollments/studentSubjectEnrollments.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import subjectAssignments from "./modules/subjectAssignments/subjectAssignments.routes.js";
import classTeacherRoutes from "./modules/classTeachers/classTeachers.routes.js";
import feesRoutes from "./modules/fees/fees.routes.js";
import schoolRoutes from "./modules/school/school.routes.js";



router.use("/students", studentsRoutes);
router.use("/classes", classesRoutes);
router.use("/sections", sectionsRoutes);
router.use("/teachers", teachersRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/exams", examsRoutes);
router.use("/setup", setupRoutes);
router.use("/academic-years", academicYearRoutes);
router.use("/subjects", subjectsRoutes);
router.use("/teacher-assignments", teacherAssignments);
router.use("/student-academics", studentAcademics);
router.use("/student-subject-enrollments", studentSubjectEnrollments);
router.use("/auth", authRoutes);
router.use("/subject-assignments", subjectAssignments);
router.use("/class-teachers", classTeacherRoutes);
router.use("/fees", feesRoutes);
router.use("/school", schoolRoutes)


router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "ERP API running" });
});


export default router;
