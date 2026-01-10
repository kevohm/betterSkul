import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Edit2 } from "lucide-react";

export default function Students() {
  // Mock data - replace with actual API calls
  const enrollments = [
    {
      id: 1,
      studentName: "Alice Johnson",
      email: "alice@example.com",
      course: "CS101",
      grade: "A",
      enrolledAt: "2024-01-15",
    },
    {
      id: 2,
      studentName: "Bob Smith",
      email: "bob@example.com",
      course: "CS101",
      grade: "B+",
      enrolledAt: "2024-01-15",
    },
    {
      id: 3,
      studentName: "Carol White",
      email: "carol@example.com",
      course: "CS201",
      grade: null,
      enrolledAt: "2024-01-20",
    },
    {
      id: 4,
      studentName: "David Brown",
      email: "david@example.com",
      course: "CS301",
      grade: "A-",
      enrolledAt: "2024-02-01",
    },
    {
      id: 5,
      studentName: "Eve Davis",
      email: "eve@example.com",
      course: "CS101",
      grade: "B",
      enrolledAt: "2024-01-15",
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
          Enrolled Students
        </h1>
        <p className="text-muted-foreground">
          View and manage grades for all enrolled students.
        </p>
      </div>

      {/* Students Table */}
      <Card>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Student Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Course
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Grade
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Enrolled
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Action
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
                      {enrollment.studentName}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {enrollment.email}
                    </td>
                    <td className="py-4 px-4 text-foreground">
                      {enrollment.course}
                    </td>
                    <td className="py-4 px-4">
                      {enrollment.grade ? (
                        <Badge className={getGradeColor(enrollment.grade)}>
                          {enrollment.grade}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No Grade</Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Edit2 className="w-4 h-4" />
                        Edit Grade
                      </Button>
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
