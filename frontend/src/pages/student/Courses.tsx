
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { BookOpen, Users, Calendar } from "lucide-react";



const Courses = () => {
  const courses = [
    {
      id: 1,
      code: "CS101",
      title: "Introduction to Computer Science",
      instructor: "Dr. Smith",
      students: 45,
      startDate: "2024-01-15",
      grade: "A",
    },
    {
      id: 2,
      code: "MATH201",
      title: "Calculus I",
      instructor: "Prof. Johnson",
      students: 32,
      startDate: "2024-01-20",
      grade: "B+",
    },
    {
      id: 3,
      code: "ENG102",
      title: "English Literature",
      instructor: "Dr. Williams",
      students: 28,
      startDate: "2024-02-01",
      grade: null,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Your Courses
        </h1>
        <p className="text-muted-foreground">
          Manage and view details of all your enrolled courses.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="outline" className="mb-3">
                  {course.code}
                </Badge>
                <h3 className="text-xl font-bold text-foreground">
                  {course.title}
                </h3>
              </div>
              {course.grade && (
                <div className="text-2xl font-bold text-primary">
                  {course.grade}
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {course.instructor}
            </p>

            <div className="space-y-2 mb-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Started {new Date(course.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              View Course
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Courses

