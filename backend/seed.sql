-- Insert an instructor user
INSERT INTO users (email, password, role)
VALUES ('alice@uni.edu', 'hashed_password_here', 'instructor');

-- Get the last inserted user_id (MySQL variable)
SET @instructor_user_id = LAST_INSERT_ID();

-- Insert instructor profile
INSERT INTO instructors (user_id, full_name)
VALUES (@instructor_user_id, 'Dr. Alice Smith');


-- Insert a student user
INSERT INTO users (email, password, role)
VALUES ('john@example.com', 'hashed_password_here', 'student');

-- Get the last inserted user_id
SET @student_user_id = LAST_INSERT_ID();

-- Insert student profile
INSERT INTO students (user_id, first_name, last_name, date_of_birth)
VALUES (@student_user_id, 'John', 'Doe', '2000-01-01');


-- Insert a course (assume instructor_id = 1 for example)
INSERT INTO courses (course_code, title, instructor_id)
VALUES ('CS101', 'Intro to CS', 1);


-- Enroll the student in the course (assume student_id = 1, course_id = 1)
INSERT INTO enrollments (student_id, course_id, grade)
VALUES (1, 1, 'A');
