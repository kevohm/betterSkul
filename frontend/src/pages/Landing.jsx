import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Book, Users, Award, Clock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Book className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">BetterSkul</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-foreground hover:text-primary transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-foreground hover:text-primary transition"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-foreground hover:text-primary transition"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to={"/login"}>
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to={"/signup"}>
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
              Streamline your course enrollment
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              A complete platform for students, instructors, and administrators
              to manage courses, enrollments, and grades seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Get started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn more
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 aspect-square flex items-center justify-center">
            <img
              src="https://img.freepik.com/premium-photo/three-diverse-students-smiling-against-colorful-background-showcasing-friendship-youth_933024-5872.jpg?uid=R220770419&ga=GA1.1.210048580.1768051796&semt=ais_hybrid&w=740&q=80" // replace with your hero image
              alt="Students collaborating"
              className="rounded-xl shadow-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-secondary/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful features for everyone
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Everything you need to manage your academic institution
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Users,
                title: "Student Management",
                description:
                  "Easily manage student profiles, enrollments, and track their academic progress",
                image:
                  "https://img.freepik.com/premium-vector/person-analyzing-data-charts-graphs-screens_926667-5631.jpg?uid=R220770419&ga=GA1.1.210048580.1768051796&semt=ais_hybrid&w=740&q=80", // add image
              },
              {
                icon: Book,
                title: "Course Creation",
                description:
                  "Create and organize courses with detailed information and instructor assignments",
                image:
                  "https://img.freepik.com/premium-photo/collaborative-teamwork-illustrated-concept-projects_1103290-4888.jpg?uid=R220770419&ga=GA1.1.210048580.1768051796&semt=ais_hybrid&w=740&q=80",
              },
              {
                icon: Award,
                title: "Grade Tracking",
                description:
                  "Monitor and record student grades with an intuitive grading system",
                image:
                  "https://img.freepik.com/free-vector/school-students-blackboard-girls-young-woman-holding-huge-pencils-raising-hands-flat-illustration_74855-11037.jpg",
              },
              {
                icon: Clock,
                title: "Real-time Updates",
                description:
                  "Get instant notifications and updates on enrollments and grade changes",
                image:
                  "https://img.freepik.com/free-vector/automatic-backup-abstract-concept-illustration_335657-1834.jpg?t=st=1768052312~exp=1768055912~hmac=1fed7fed0e747b48ad8c5619c24af7ddb24885787f1cfc295ef8ca0be7f46276&w=1480",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-lg p-8 border border-border hover:shadow-lg transition flex flex-col md:flex-row items-center gap-6"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4 md:mb-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-32 h-32 object-cover rounded-lg hidden md:block"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
          How it works
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Sign up",
              description:
                "Create your account as a student, instructor, or administrator",
            },
            {
              step: "02",
              title: "Manage courses",
              description:
                "Create courses or browse available courses to enroll in",
            },
            {
              step: "03",
              title: "Track progress",
              description:
                "Monitor enrollments, grades, and academic performance in real-time",
            },
          ].map((item, i) => (
            <div key={i} className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-balance">
            Ready to transform your institution?
          </h2>
          <p className="text-lg mb-8 text-blue-50 text-balance">
            Join thousands of educational institutions using BetterSkul
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Start your free trial <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                  <Book className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-primary">BetterSkul</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Streamline your education platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 BetterSkul. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition">
                Twitter
              </a>
              <a href="#" className="hover:text-primary transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-primary transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
