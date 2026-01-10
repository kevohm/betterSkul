import { Book, LogOut, Settings, Home as HomeIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Link, Outlet } from "@tanstack/react-router";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { BookOpen, Award, Clock } from "lucide-react";

export default function Home() {
  const student = {
    name: "John Doe",
    email: "john@example.com",
  };

  const enrollments = [
    {
      id: 1,
      courseCode: "CS101",
      title: "Introduction to Computer Science",
      instructorName: "Dr. Smith",
      grade: "A",
      enrolledAt: "2024-01-15",
    },
    {
      id: 2,
      courseCode: "MATH201",
      title: "Calculus I",
      instructorName: "Prof. Johnson",
      grade: "B+",
      enrolledAt: "2024-01-20",
    },
    {
      id: 3,
      courseCode: "ENG102",
      title: "English Literature",
      instructorName: "Dr. Williams",
      grade: null,
      enrolledAt: "2024-02-01",
    },
    {
      id: 4,
      courseCode: "PHYS150",
      title: "Physics Fundamentals",
      instructorName: "Prof. Brown",
      grade: "A-",
      enrolledAt: "2024-01-25",
    },
  ];

  const getGradeColor = (grade: string | null) => {
    if (!grade) return "bg-muted text-muted-foreground";
    if (grade.startsWith("A")) return "bg-green-100 text-green-700";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome back, {student.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your enrolled courses and grades.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enrolled Courses</p>
              <p className="text-2xl font-bold text-foreground">
                {enrollments.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current GPA</p>
              <p className="text-2xl font-bold text-foreground">3.8</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Courses</p>
              <p className="text-2xl font-bold text-foreground">
                {enrollments.filter((e) => !e.grade).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Your Courses
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Course Code
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Course Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Instructor
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Grade
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Enrolled
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="border-b border-border hover:bg-secondary/50 transition"
                  >
                    <td className="py-4 px-4 text-foreground font-medium">
                      {enrollment.courseCode}
                    </td>
                    <td className="py-4 px-4 text-foreground">
                      {enrollment.title}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {enrollment.instructorName}
                    </td>
                    <td className="py-4 px-4">
                      {enrollment.grade ? (
                        <Badge className={getGradeColor(enrollment.grade)}>
                          {enrollment.grade}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
