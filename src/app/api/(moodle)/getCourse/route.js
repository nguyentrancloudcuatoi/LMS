// import { NextResponse } from 'next/server';

// export async function GET(req, res) {
//     const TOKEN = '7c3afb790462432d924aef3f79a90b22';
//     const MOODLE_URL = 'https://learn.s4h.edu.vn/webservice/rest/server.php';

//     try {
//         // Lấy danh sách khóa học
//         const coursesResponse = await fetch(`${MOODLE_URL}?wstoken=${TOKEN}&wsfunction=core_course_get_courses&moodlewsrestformat=json`);
//         const courses = await coursesResponse.json();

//         if (!courses || courses.length === 0) {
//             return res.status(404).json({ message: 'No courses found' });
//         }

//         const courseId = 30;
//         const assignmentsResponse = await fetch(`${MOODLE_URL}?wstoken=${TOKEN}&wsfunction=mod_assign_get_assignments&courseids[0]=${courseId}&moodlewsrestformat=json`);
//         const assignments = await assignmentsResponse.json();

//         if (!assignments || !assignments.courses || assignments.courses.length === 0) {
//             return NextResponse.json({ message: 'No assignments found' });
//         }

//         // // Lấy thông tin nộp bài cho từng bài tập
//         const submissionsPromises = assignments.courses[0].assignments.map(async (assignment) => {
//             const submissionResponse = await fetch(`${MOODLE_URL}?wstoken=${TOKEN}&wsfunction=mod_assign_get_submissions&assignmentids[0]=${assignment.id}&moodlewsrestformat=json`);
//             const submission = await submissionResponse.json();
//             return { assignment, submission };
//         });

//         const submissions = await Promise.all(submissionsPromises);

//         return NextResponse.json({ courses, assignments, submissions });
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return NextResponse.json({ message: 'Internal server error' });
//     }
// }