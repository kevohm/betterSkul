import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";


const Courses = () => {
  // Mock data - replace with actual API calls
  const courses = [
    {
      id: 1,
      code: "CS101",
      title: "Introduction to Computer Science",
      studentCount: 35,
      description:
        "Learn the fundamentals of computer science including programming basics, algorithms, and data structures.",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      code: "CS201",
      title: "Data Structures",
      studentCount: 28,
      description:
        "Deep dive into data structures: arrays, linked lists, trees, graphs, and their applications.",
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      code: "CS301",
      title: "Advanced Algorithms",
      studentCount: 22,
      description:
        "Advanced algorithm design techniques including dynamic programming, graph algorithms, and complexity analysis.",
      createdAt: "2024-02-01",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            My Courses
          </h1>
          <p className="text-muted-foreground">
            Manage and view all your courses.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-6 hover:shadow-md transition">
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary">{course.code}</Badge>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {course.description}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {course.studentCount}
                </span>{" "}
                students enrolled
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-transparent"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-transparent"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}  

export default Courses

