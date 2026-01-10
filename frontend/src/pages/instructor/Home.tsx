import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { BookOpen, Users, BarChart3 } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useMe } from "../../features/auth/hooks";

const Home = () => {
  // const  {full_name} = useAuth()
  const { data, isLoading } = useMe();

  const courses = [
    {
      id: 1,
      code: "CS101",
      title: "Introduction to Computer Science",
      studentCount: 35,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      code: "CS201",
      title: "Data Structures",
      studentCount: 28,
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      code: "CS301",
      title: "Advanced Algorithms",
      studentCount: 22,
      createdAt: "2024-02-01",
    },
  ];

  const totalStudents = courses.reduce(
    (sum, course) => sum + course.studentCount,
    0
  );
  const totalCourses = courses.length;
  
  if (isLoading) return <div>Loading..</div>;

  const instructor = {
    name: data?.full_name,
    email: "smith@example.com",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Welcome back, {instructor.name}!
        </h1>
        <p className="text-muted-foreground">
          Manage your courses and monitor student progress.
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
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold text-foreground">
                {totalCourses}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">
                {totalStudents}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Class Size</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(totalStudents / totalCourses)}
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
                    Students Enrolled
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-border hover:bg-secondary/50 transition"
                  >
                    <td className="py-4 px-4 text-foreground font-medium">
                      {course.code}
                    </td>
                    <td className="py-4 px-4 text-foreground">
                      {course.title}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">
                        {course.studentCount} students
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {new Date(course.createdAt).toLocaleDateString()}
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
};

export default Home;
