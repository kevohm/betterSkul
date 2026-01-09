INSERT INTO instructors (full_name, email)
VALUES ('Dr. Alice Smith', 'alice@uni.edu');

INSERT INTO students (first_name, last_name, email)
VALUES ('John', 'Doe', 'john@example.com');

INSERT INTO courses (course_code, title, instructor_id)
VALUES ('CS101', 'Intro to CS', 1);

INSERT INTO enrollments (student_id, course_id, grade)
VALUES (1, 1, 'A');
