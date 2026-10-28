




const defaultData = {
  teachers: [
    {
      id: 'T01',
      name: 'Mrs. Priya Krishnan',
      roleType: 'Teacher',
      phone: '+91 98401 23451',
      email: 'priya.k@ssvschool.com',
      address: '14, Gandhi Road, Chennai, Tamil Nadu - 600028',
      bloodGroup: 'O+',
      qualification: 'M.Sc., B.Ed',
      subject: 'Mathematics',
      onboardSubject: 'Mathematics',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      status: 'Active'
    },
    {
      id: 'T02',
      name: 'Dr. Anandhi Rajan',
      roleType: 'Teacher',
      phone: '+91 98401 23452',
      email: 'anandhi.r@ssvschool.com',
      address: '88, Anna Salai, Chennai, Tamil Nadu - 600002',
      bloodGroup: 'A+',
      qualification: 'Ph.D., M.Sc., B.Ed',
      subject: 'Physics',
      onboardSubject: 'Physics',
      class: 'Grade 11-B',
      schoolId: 'SCHOOL002',
      status: 'Active'
    },
    {
      id: 'T03',
      name: 'Mrs. Selvi Murugan',
      roleType: 'Teacher',
      phone: '+91 98401 23455',
      email: 'selvi.m@ssvschool.com',
      address: '22, Kamaraj Nagar, Chennai, Tamil Nadu - 600041',
      bloodGroup: 'B+',
      qualification: 'M.Sc. Chemistry, B.Ed',
      subject: 'Chemistry',
      onboardSubject: 'Chemistry',
      class: 'Grade 9-A',
      schoolId: 'SCHOOL002',
      status: 'Active'
    }
  ],

  students: [
    {
      roll: 'S101',
      name: 'Aishwarya Kumar',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '96%',
      performance: 'Outstanding',
      parentName: 'Mr. Kumarasamy (Father)',
      parentPhone: '+91 98401 55210',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 98, grade: 'A+' },
        { subject: 'Physics', max: 100, scored: 92, grade: 'A+' },
        { subject: 'Chemistry', max: 100, scored: 86, grade: 'A' },
        { subject: 'Tamil', max: 100, scored: 94, grade: 'A+' },
        { subject: 'English', max: 100, scored: 90, grade: 'A+' }
      ]
    },
    {
      roll: 'S102',
      name: 'Kavitha Selvam',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '92%',
      performance: 'Very Good',
      parentName: 'Mr. Selvam Raman (Father)',
      parentPhone: '+91 94440 88731',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 88, grade: 'A' },
        { subject: 'Physics', max: 100, scored: 84, grade: 'A' },
        { subject: 'Chemistry', max: 100, scored: 90, grade: 'A+' },
        { subject: 'Tamil', max: 100, scored: 85, grade: 'A' },
        { subject: 'English', max: 100, scored: 82, grade: 'A' }
      ]
    },
    {
      roll: 'S103',
      name: 'Sandhya Ramesh',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '88%',
      performance: 'Good',
      parentName: 'Mrs. Geetha Ramesh (Mother)',
      parentPhone: '+91 98840 12399',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 74, grade: 'B' },
        { subject: 'Physics', max: 100, scored: 78, grade: 'B' },
        { subject: 'Chemistry', max: 100, scored: 'AB', grade: 'AB' },
        { subject: 'Tamil', max: 100, scored: 80, grade: 'A' },
        { subject: 'English', max: 100, scored: 76, grade: 'B' }
      ]
    },
    {
      roll: 'S104',
      name: 'Deepa Venkatesh',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '94%',
      performance: 'Outstanding',
      parentName: 'Mr. Venkatesh R (Father)',
      parentPhone: '+91 97910 65421',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 95, grade: 'A+' },
        { subject: 'Physics', max: 100, scored: 91, grade: 'A+' },
        { subject: 'Chemistry', max: 100, scored: 89, grade: 'A' },
        { subject: 'Tamil', max: 100, scored: 92, grade: 'A+' },
        { subject: 'English', max: 100, scored: 88, grade: 'A' }
      ]
    },
    {
      roll: 'S105',
      name: 'Meena Natarajan',
      class: 'Grade 10-A',
      schoolId: 'SCHOOL002',
      attendance: '90%',
      performance: 'Very Good',
      parentName: 'Mrs. Lakshmi Natarajan (Mother)',
      parentPhone: '+91 94451 77209',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 82, grade: 'A' },
        { subject: 'Physics', max: 100, scored: 85, grade: 'A' },
        { subject: 'Chemistry', max: 100, scored: 80, grade: 'A' },
        { subject: 'Tamil', max: 100, scored: 'AB', grade: 'AB' },
        { subject: 'English', max: 100, scored: 86, grade: 'A' }
      ]
    },
    {
      roll: 'S106',
      name: 'Priyadarshini Sundaram',
      class: 'Grade 11-B',
      schoolId: 'SCHOOL002',
      attendance: '95%',
      performance: 'Outstanding',
      parentName: 'Mr. Sundaram Pillai (Father)',
      parentPhone: '+91 98412 33418',
      marks: [
        { subject: 'Mathematics', max: 100, scored: 96, grade: 'A+' },
        { subject: 'Physics', max: 100, scored: 94, grade: 'A+' },
        { subject: 'Chemistry', max: 100, scored: 90, grade: 'A+' }
      ]
    }
  ],

  classes: [
    { name: 'Grade 10-A', teacher: 'Mrs. Priya Krishnan', strength: 38, room: 'A-102', schoolId: 'SCHOOL002' },
    { name: 'Grade 10-B', teacher: 'Mr. K. Manickam', strength: 36, room: 'A-104', schoolId: 'SCHOOL002' },
    { name: 'Grade 11-B', teacher: 'Dr. Anandhi Rajan', strength: 40, room: 'B-204', schoolId: 'SCHOOL002' }
  ],

  classTimetables: [
    { className: 'Grade 10-A', day: 'Monday', period: 1, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Monday', period: 2, subject: 'Tamil', teacherName: 'Mr. K. Manickam', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Monday', period: 3, subject: 'English', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Monday', period: 4, subject: 'Social Science', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Monday', period: 5, subject: 'Biology', teacherName: 'Dr. Savithri Raman', schoolId: 'SCHOOL002' },

    { className: 'Grade 10-A', day: 'Tuesday', period: 1, subject: 'Tamil', teacherName: 'Mr. K. Manickam', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Tuesday', period: 2, subject: 'Physics', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Tuesday', period: 3, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Tuesday', period: 4, subject: 'Social Science', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Tuesday', period: 5, subject: 'English', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },

    { className: 'Grade 10-A', day: 'Wednesday', period: 1, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Wednesday', period: 2, subject: 'Chemistry', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Wednesday', period: 3, subject: 'Physics', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Wednesday', period: 4, subject: 'Biology', teacherName: 'Dr. Savithri Raman', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Wednesday', period: 5, subject: 'Tamil', teacherName: 'Mr. K. Manickam', schoolId: 'SCHOOL002' },

    { className: 'Grade 10-A', day: 'Thursday', period: 1, subject: 'English', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Thursday', period: 2, subject: 'Physics', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Thursday', period: 3, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Thursday', period: 4, subject: 'Chemistry', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Thursday', period: 5, subject: 'Social Science', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' },

    { className: 'Grade 10-A', day: 'Friday', period: 1, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Friday', period: 2, subject: 'Tamil', teacherName: 'Mr. K. Manickam', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Friday', period: 3, subject: 'English', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Friday', period: 4, subject: 'Biology', teacherName: 'Dr. Savithri Raman', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-A', day: 'Friday', period: 5, subject: 'Computer Science', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },

    { className: 'Grade 11-B', day: 'Monday', period: 1, subject: 'Computer Science', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 11-B', day: 'Monday', period: 2, subject: 'Physics', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 11-B', day: 'Tuesday', period: 3, subject: 'Chemistry', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' },
    { className: 'Grade 11-B', day: 'Wednesday', period: 1, subject: 'Physics', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 11-B', day: 'Thursday', period: 2, subject: 'Chemistry', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' },
    { className: 'Grade 11-B', day: 'Friday', period: 3, subject: 'Computer Science', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },

    { className: 'Grade 10-B', day: 'Monday', period: 1, subject: 'Tamil', teacherName: 'Mr. K. Manickam', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Monday', period: 2, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Monday', period: 3, subject: 'Physics', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Tuesday', period: 1, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Tuesday', period: 2, subject: 'Chemistry', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Wednesday', period: 1, subject: 'English', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Wednesday', period: 2, subject: 'Biology', teacherName: 'Dr. Savithri Raman', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Thursday', period: 1, subject: 'Tamil', teacherName: 'Mr. K. Manickam', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Thursday', period: 2, subject: 'Social Science', teacherName: 'Mrs. Selvi Murugan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Friday', period: 1, subject: 'Mathematics', teacherName: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002' },
    { className: 'Grade 10-B', day: 'Friday', period: 2, subject: 'Computer Science', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' }
  ],

  subjects: [
    { code: 'MAT-10', name: 'Mathematics', grade: 'Grade 10-A', teacher: 'Mrs. Priya Krishnan', periodsPerWeek: 6, room: 'A-102', schoolId: 'SCHOOL002' },
    { code: 'PHY-11', name: 'Physics', grade: 'Grade 11-B', teacher: 'Dr. Anandhi Rajan', periodsPerWeek: 5, room: 'Lab-1', schoolId: 'SCHOOL002' },
    { code: 'CHE-09', name: 'Chemistry', grade: 'Grade 9-A', teacher: 'Mrs. Selvi Murugan', periodsPerWeek: 5, room: 'Lab-2', schoolId: 'SCHOOL002' },
    { code: 'BIO-10', name: 'Biology & Life Sciences', grade: 'Grade 10-A', teacher: 'Dr. Savithri Raman', periodsPerWeek: 4, room: 'Bio-Lab', schoolId: 'SCHOOL002' },
    { code: 'TAM-10', name: 'Tamil (Language I)', grade: 'Grade 10-A', teacher: 'Mr. K. Manickam', periodsPerWeek: 6, room: 'A-102', schoolId: 'SCHOOL002' },
    { code: 'ENG-10', name: 'English (Language II)', grade: 'Grade 10-A', teacher: 'Mrs. Priya Krishnan', periodsPerWeek: 5, room: 'A-102', schoolId: 'SCHOOL002' },
    { code: 'CSC-11', name: 'Computer Science & Coding', grade: 'Grade 11-B', teacher: 'Dr. Anandhi Rajan', periodsPerWeek: 4, room: 'Comp-Lab', schoolId: 'SCHOOL002' },
    { code: 'SOC-10', name: 'Social Science & History', grade: 'Grade 10-A', teacher: 'Mrs. Selvi Murugan', periodsPerWeek: 4, room: 'A-102', schoolId: 'SCHOOL002' }
  ],

  assignments: [
    { id: 'HW01', title: 'Algebra Equations Exercise', givenDate: '2026-07-20', due: '2026-07-28', grade: 'Grade 10-A', subject: 'Mathematics', instructions: 'Solve exercises 3.1 to 3.4 in trigonometry notebook.', assignedBy: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002', assignedDate: '2026-07-20' },
    { id: 'HW02', title: 'Newtonian Laws Essay', givenDate: '2026-07-22', due: '2026-07-30', grade: 'Grade 11-B', subject: 'Physics', instructions: 'Read chapter on kinetic energy laws and write 500 words essay.', assignedBy: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002', assignedDate: '2026-07-22' }
  ],

  studyMaterials: [
    { id: 'MAT-01', title: 'Trigonometry & Heights Formulas Sheet', grade: 'Grade 10-A', subject: 'Mathematics', fileName: 'Trigonometry_Complete_Guide.pdf', fileSize: '2.4 MB', fileType: 'PDF', uploadedBy: 'Mrs. Priya Krishnan', date: '2026-10-18', description: 'Comprehensive formula summary, identities, and angle values table.' },
    { id: 'MAT-02', title: 'Quadratic Equations Practice Problems Set', grade: 'Grade 10-A', subject: 'Mathematics', fileName: 'Quadratic_Equations_Problems.pdf', fileSize: '1.8 MB', fileType: 'PDF', uploadedBy: 'Mrs. Priya Krishnan', date: '2026-10-20', description: '50 previous board exam solved problems with step-by-step methods.' },
    { id: 'MAT-03', title: 'Coordinate Geometry Visual Notes', grade: 'Grade 10-A', subject: 'Mathematics', fileName: 'Coordinate_Geometry_Charts.pdf', fileSize: '3.1 MB', fileType: 'PDF', uploadedBy: 'Mrs. Priya Krishnan', date: '2026-10-22', description: 'Section formula, distance equation diagrams and practical questions.' },
    { id: 'MAT-04', title: 'Physics Light & Optics Chapter Handbook', grade: 'Grade 11-B', subject: 'Physics', fileName: 'Ray_Optics_Notes.pdf', fileSize: '4.2 MB', fileType: 'PDF', uploadedBy: 'Dr. Anandhi Rajan', date: '2026-10-21', description: 'Lenses, refraction and mirror formulas with colored ray diagrams.' },
  ],

  exams: [
    { id: 'EX-101', name: 'Midterm Examination 2026', subject: 'Mathematics (Paper-I)', grade: 'Grade 10-A', date: '2026-09-10', time: '09:30 AM - 12:30 PM', room: 'Hall A-1', maxMarks: 100, passMarks: 35, status: 'Scheduled', uploadedBy: 'Principal Office' },
    { id: 'EX-102', name: 'Midterm Examination 2026', subject: 'Science & Experiments', grade: 'Grade 10-A', date: '2026-09-12', time: '09:30 AM - 12:30 PM', room: 'Science Lab 1', maxMarks: 100, passMarks: 35, status: 'Scheduled', uploadedBy: 'Mrs. Priya Krishnan' },
    { id: 'EX-103', name: 'Midterm Examination 2026', subject: 'Tamil Language', grade: 'Grade 10-A', date: '2026-09-14', time: '09:30 AM - 12:30 PM', room: 'Hall A-1', maxMarks: 100, passMarks: 35, status: 'Scheduled', uploadedBy: 'Principal Office' },
    { id: 'EX-104', name: 'Midterm Examination 2026', subject: 'English (Language & Lit)', grade: 'Grade 10-A', date: '2026-09-16', time: '09:30 AM - 12:30 PM', room: 'Hall A-1', maxMarks: 100, passMarks: 35, status: 'Scheduled', uploadedBy: 'Principal Office' },
    { id: 'EX-105', name: 'Midterm Examination 2026', subject: 'Social Science & History', grade: 'Grade 10-A', date: '2026-09-18', time: '09:30 AM - 12:30 PM', room: 'Hall A-1', maxMarks: 100, passMarks: 35, status: 'Scheduled', uploadedBy: 'Mrs. Selvi Murugan' },
    { id: 'EX-106', name: 'Quarterly Unit Test', subject: 'Physics (Theory & Lab)', grade: 'Grade 11-B', date: '2026-09-22', time: '10:00 AM - 01:00 PM', room: 'Physics Lab', maxMarks: 70, passMarks: 25, status: 'Scheduled', uploadedBy: 'Dr. Anandhi Rajan' },
    { id: 'EX-107', name: 'Quarterly Unit Test', subject: 'Computer Science Practical', grade: 'Grade 11-B', date: '2026-09-24', time: '10:00 AM - 01:00 PM', room: 'Comp Lab 2', maxMarks: 50, passMarks: 18, status: 'Scheduled', uploadedBy: 'Dr. Anandhi Rajan' },
  ],

  attendanceLogs: [
    {
      date: '2026-10-24',
      className: 'Grade 10-A',
      markedBy: 'Mrs. Priya Krishnan',
      timestamp: '2026-10-24T09:15:00.000Z',
      records: {
        S101: 'present',
        S102: 'present',
        S103: 'present',
        S104: 'present',
        S105: 'present'
      }
    },
    {
      date: '2026-10-23',
      className: 'Grade 10-A',
      markedBy: 'Mrs. Priya Krishnan',
      timestamp: '2026-10-23T09:10:00.000Z',
      records: {
        S101: 'present',
        S102: 'present',
        S103: 'absent',
        S104: 'present',
        S105: 'present'
      }
    },
    {
      date: '2026-10-22',
      className: 'Grade 10-A',
      markedBy: 'Mrs. Priya Krishnan',
      timestamp: '2026-10-22T09:12:00.000Z',
      records: {
        S101: 'present',
        S102: 'present',
        S103: 'present',
        S104: 'present',
        S105: 'present'
      }
    },
    {
      date: '2026-10-21',
      className: 'Grade 10-A',
      markedBy: 'Mrs. Priya Krishnan',
      timestamp: '2026-10-21T09:15:00.000Z',
      records: {
        S101: 'present',
        S102: 'absent',
        S103: 'present',
        S104: 'present',
        S105: 'present'
      }
    },
    {
      date: '2026-10-20',
      className: 'Grade 10-A',
      markedBy: 'Mrs. Priya Krishnan',
      timestamp: '2026-10-20T09:10:00.000Z',
      records: {
        S101: 'present',
        S102: 'present',
        S103: 'present',
        S104: 'present',
        S105: 'present'
      }
    }
  ],

  announcements: [
    {
      id: 'ANN-01',
      date: '2026-10-22',
      title: 'District Level Volleyball Championship 2026 — Finals',
      target: 'Sports Team',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
      content: 'Our senior girls volleyball team has qualified for the State Division Finals! All team members report to the sports ground by 3:30 PM for final coach briefing and kit distribution.',
      author: 'Sports Department',
      priority: 'High',
      schoolId: 'SCHOOL002'
    },
    {
      id: 'ANN-02',
      date: '2026-10-18',
      title: 'Annual Science & Robotics Tech Expo 2026',
      target: 'All',
      category: 'Academic',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      content: 'Zen School is hosting the Inter-School Science and AI Innovation Expo. Students from Grades 8 to 12 can exhibit their working models in Robotics, Clean Energy, and Software Apps.',
      author: 'Academic Council',
      priority: 'Medium',
      schoolId: 'SCHOOL002'
    },
    {
      id: 'ANN-03',
      date: '2026-10-12',
      title: 'Parent-Teacher Interaction Meet (Term 1 Review)',
      target: 'Parents',
      category: 'General',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
      content: 'Term 1 progress report cards and behavioral assessment discussions will take place this Saturday between 09:30 AM and 01:00 PM. All parents are warmly invited.',
      author: 'Office of Principal',
      priority: 'High',
      schoolId: 'SCHOOL002'
    }
  ],

  principals: [
    {
      id: 'PR001',
      name: 'Dr. Savithri Raman',
      roleType: 'Principal',
      qualification: 'Ph.D., M.Ed',
      experience: '18 Years',
      phone: '+91 98401 23450',
      email: 'principal@ssvschool.com',
      address: '10, Cathedral Road, Chennai, Tamil Nadu - 600086',
      bloodGroup: 'B+',
      username: 'principal',
      status: 'Active',
      joinedDate: '2020-06-01',
      schoolId: 'SCHOOL002'
    }
  ],

  parents: [
    { id: 'PAR001', name: 'Ramesh Kumar', relationship: 'Father', phone: '+91 98401 99009', email: 'ramesh.k@gmail.com', studentName: 'Aishwarya Kumar', studentRoll: 'S101', schoolId: 'SCHOOL002' },
    { id: 'PAR002', name: 'Selvam Periasamy', relationship: 'Father', phone: '+91 98402 33445', email: 'selvam.p@gmail.com', studentName: 'Kavitha Selvam', studentRoll: 'S102', schoolId: 'SCHOOL002' },
    { id: 'PAR003', name: 'Geetha Ramesh', relationship: 'Mother', phone: '+91 98840 12399', email: 'geetha.r@gmail.com', studentName: 'Sandhya Ramesh', studentRoll: 'S103', schoolId: 'SCHOOL002' },
    { id: 'PAR004', name: 'Venkatesh R', relationship: 'Father', phone: '+91 97910 65421', email: 'venkatesh.r@gmail.com', studentName: 'Deepa Venkatesh', studentRoll: 'S104', schoolId: 'SCHOOL002' },
    { id: 'PAR005', name: 'Lakshmi Natarajan', relationship: 'Mother', phone: '+91 94451 77209', email: 'lakshmi.n@gmail.com', studentName: 'Meena Natarajan', studentRoll: 'S105', schoolId: 'SCHOOL002' },
    { id: 'PAR006', name: 'Murugan Palani', relationship: 'Father', phone: '+91 98403 66778', email: 'murugan.p@gmail.com', studentName: 'Rithanya Murugan', studentRoll: 'S107', schoolId: 'SCHOOL002' },
    { id: 'PAR007', name: 'Sundaram Pillai', relationship: 'Father', phone: '+91 98412 33418', email: 'sundaram.p@gmail.com', studentName: 'Priyadarshini Sundaram', studentRoll: 'S106', schoolId: 'SCHOOL002' }
  ],

  users: [
    { id: 'USR001', name: 'Dr. Savithri Raman', role: 'PRINCIPAL', phone: '+91 98401 23450', email: 'principal@ssvschool.com', username: 'principal', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR002', name: 'School Administrator (SSV)', role: 'SCHOOL_ADMIN', phone: '+91 98401 23456', email: 'admin@ssvschool.com', username: 'admin', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR003', name: 'Mrs. Priya Krishnan', role: 'TEACHER', phone: '+91 98401 23451', email: 'priya.k@ssvschool.com', username: 'priya', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR004', name: 'Dr. Anandhi Rajan', role: 'TEACHER', phone: '+91 98401 23452', email: 'anandhi.r@ssvschool.com', username: 'anandhi', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR005', name: 'Aishwarya Kumar', role: 'STUDENT', phone: '+91 98401 23453', email: 'aishwarya@ssvschool.com', username: 'aishwarya', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR006', name: 'Kavitha Selvam', role: 'STUDENT', phone: '+91 98401 23454', email: 'kavitha@ssvschool.com', username: 'kavitha', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002' },
    { id: 'USR007', name: 'Ramesh Kumar', role: 'PARENT', phone: '+91 98401 99009', email: 'ramesh.k@gmail.com', username: 'parent', status: 'Active', createdDate: '2026-02-15', schoolId: 'SCHOOL002', studentName: 'Aishwarya Kumar', studentRoll: 'S101', relationship: 'Father' },
  ],

  nonTeachingStaff: [
    { id: 'NT01', name: 'Mr. R. Muthuraman', role: 'Head Clerk & Office Admin', department: 'Administrative Office', phone: '+91 98401 55601', status: 'On Duty', shift: '08:00 AM - 04:30 PM', workAssigned: 'Student Records, TC & Attendance Registers' },
    { id: 'NT02', name: 'Mrs. S. Gandhimathi', role: 'Chief Accountant', department: 'Accounts & Billing', phone: '+91 98401 55602', status: 'On Duty', shift: '08:30 AM - 05:00 PM', workAssigned: 'Term Fee Reconciliation & Petty Cash' },
    { id: 'NT03', name: 'Mr. K. Palanivel', role: 'Senior Lab Attender', department: 'Physics & Chemistry Labs', phone: '+91 98401 55603', status: 'On Duty', shift: '08:30 AM - 04:30 PM', workAssigned: 'Lab Equipment, Glassware & Chemical Safety' },
    { id: 'NT04', name: 'Mrs. V. Meenakshi', role: 'Librarian & Cataloguer', department: 'Central Library', phone: '+91 98401 55604', status: 'On Duty', shift: '08:30 AM - 04:30 PM', workAssigned: 'Book Lending, Library Database & Quiet Hours' },
    { id: 'NT05', name: 'Mr. G. Karuppiah', role: 'Campus Security & Gate Supervisor', department: 'Security & Safety', phone: '+91 98401 55605', status: 'On Duty', shift: '07:30 AM - 04:00 PM', workAssigned: 'Gate Pass Check, Visitor Registry & CCTV' },
    { id: 'NT06', name: 'Mrs. M. Vasantha', role: 'Office Attender / Peon', department: 'General Administration', phone: '+91 98401 55606', status: 'On Duty', shift: '08:00 AM - 04:30 PM', workAssigned: 'Circular Delivery, Staff Room & Bell Routine' },
    { id: 'NT07', name: 'Mr. T. Saravanan', role: 'Campus Maintenance & Electrician', department: 'Infrastructure & Power', phone: '+91 98401 55607', status: 'On Duty', shift: '08:00 AM - 05:00 PM', workAssigned: 'UPS/Generator Check & RO Water Audit' },
    { id: 'NT08', name: 'Mrs. K. Rajeshwari', role: 'Health & First Aid Attendant', department: 'Health Clinic', phone: '+91 98401 55608', status: 'On Leave', shift: '08:30 AM - 04:00 PM', workAssigned: 'Infirmary Log & Emergency Aid (Covered by Clinic Asst)' },
  ],

  operationsWorks: [
    { id: 'WRK-01', title: 'Daily Campus Cleanliness & Sanitation Audit', department: 'Sanitation & Hygiene', assignedTo: 'Housekeeping Team', priority: 'High', status: 'Completed', deadline: 'Today, 08:30 AM', progress: 100 },
    { id: 'WRK-02', title: 'Midterm Science Lab Chemicals & Equipment Safety Verification', department: 'Science Labs', assignedTo: 'Mr. K. Palanivel', priority: 'High', status: 'In Progress', deadline: 'Today, 01:00 PM', progress: 85 },
    { id: 'WRK-03', title: 'Library Book Returns & Missing Register Reconciliation', department: 'Central Library', assignedTo: 'Mrs. V. Meenakshi', priority: 'Medium', status: 'Completed', deadline: 'Today, 11:30 AM', progress: 100 },
    { id: 'WRK-04', title: 'RO Drinking Water Plant Filter & TDS Level Inspection', department: 'Campus Maintenance', assignedTo: 'Mr. T. Saravanan', priority: 'High', status: 'Completed', deadline: 'Today, 09:00 AM', progress: 100 },
    { id: 'WRK-05', title: 'CCTV Surveillance & Campus Boundary Gate Checks', department: 'Security & Safety', assignedTo: 'Mr. G. Karuppiah', priority: 'Urgent', status: 'Completed', deadline: 'Today, 08:00 AM', progress: 100 },
    { id: 'WRK-06', title: 'Student Fee Dues Reminder SMS Dispatch to Parents', department: 'Accounts Section', assignedTo: 'Mrs. S. Gandhimathi', priority: 'Medium', status: 'In Progress', deadline: 'Today, 03:30 PM', progress: 70 },
    { id: 'WRK-07', title: 'Quarterly Government EMIS Portal Data Sync', department: 'Administrative Office', assignedTo: 'Mr. R. Muthuraman', priority: 'High', status: 'In Progress', deadline: 'Today, 05:00 PM', progress: 60 },
    { id: 'WRK-08', title: 'Fire Safety Extinguishers & First-Aid Box Refill Verification', department: 'Health & Safety', assignedTo: 'Clinic & Maintenance', priority: 'Medium', status: 'Scheduled', deadline: 'Tomorrow, 10:00 AM', progress: 20 },
  ],

  services: [
    { id: 'SRV-01', name: 'Coding for Kids', icon: '', category: 'Technology', status: 'Active', cost: '0/yr', description: 'Interactive Python, Scratch block coding, and basic algorithmic thinking for students.', visibleRoles: ['schooladmin', 'teacher', 'student'] },
    { id: 'SRV-02', name: 'Chess Academy', icon: '', category: 'Mind Sports', status: 'Active', cost: '0/yr', description: 'Grandmaster tactics, opening strategies, and tournament training.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
    { id: 'SRV-03', name: 'Robotics', icon: '', category: 'STEM', status: 'Active', cost: '0/yr', description: 'Arduino, sensor kits, circuit building and autonomous robot design.', visibleRoles: ['schooladmin', 'teacher', 'student'] },
    { id: 'SRV-04', name: 'Drawing & Art', icon: '', category: 'Creative Arts', status: 'Active', cost: '0/yr', description: 'Watercolors, canvas painting, sketch portraiture and digital design.', visibleRoles: ['schooladmin', 'student', 'parent'] },
    { id: 'SRV-05', name: 'Spoken English', icon: '', category: 'Communication', status: 'Active', cost: '0/yr', description: 'Vocabulary building, public speaking, pronunciation and phonics.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
    { id: 'SRV-06', name: 'Abacus & Vedic Maths', icon: '', category: 'Mathematics', status: 'Active', cost: '0/yr', description: 'Fast mental calculation techniques, memory retention, and number speed.', visibleRoles: ['schooladmin', 'teacher', 'student', 'parent'] },
    { id: 'SRV-07', name: 'Dance & Music', icon: '', category: 'Performing Arts', status: 'Active', cost: '0/yr', description: 'Classical & contemporary dance, vocal music, keyboard and guitar lessons.', visibleRoles: ['schooladmin', 'student', 'parent'] },
    { id: 'SRV-08', name: 'Sports & Fitness', icon: '', category: 'Athletics', status: 'Active', cost: '0/yr', description: 'Football, basketball, athletics coaching, yoga and physical agility.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
  ],

  staffLeaves: [
    { id: 'LV-101', teacher: 'Mrs. Selvi Murugan', subject: 'Chemistry', dates: '2026-10-24 to 2026-10-25', reason: 'Family Function in Madurai', status: 'Pending', type: 'Casual Leave' },
    { id: 'LV-102', teacher: 'Dr. Anandhi Rajan', subject: 'Physics', dates: '2026-10-28', reason: 'Medical Appointment', status: 'Pending', type: 'Medical Leave' },
    { id: 'LV-100', teacher: 'Mr. Anand Narayanan', subject: 'Physics', dates: '2026-10-15', reason: 'Educational Conference', status: 'Approved', type: 'Duty Leave' },
    { id: 'LV-103', teacher: 'Mrs. Priya Krishnan', subject: 'Mathematics', dates: '2026-10-20 to 2026-10-21', reason: 'Attending University Valuation Board', status: 'Approved', type: 'Duty Leave' },
  ],

  schoolServiceAssignments: [
    { id: 'SSA-01', serviceId: 'SRV-01', serviceName: 'Coding for Kids', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-01-15' },
    { id: 'SSA-02', serviceId: 'SRV-02', serviceName: 'Chess Academy', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-01-20' },
    { id: 'SSA-03', serviceId: 'SRV-03', serviceName: 'Robotics', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-02-01' },
    { id: 'SSA-04', serviceId: 'SRV-04', serviceName: 'Drawing & Art', schoolId: 'SCHOOL001', schoolName: 'ABC Matriculation School', status: 'Active', assignedDate: '2026-01-10' },
    { id: 'SSA-05', serviceId: 'SRV-05', serviceName: 'Spoken English', schoolId: 'SCHOOL001', schoolName: 'ABC Matriculation School', status: 'Inactive', assignedDate: '2026-01-12' },
    { id: 'SSA-06', serviceId: 'SRV-06', serviceName: 'Abacus & Vedic Maths', schoolId: 'SCHOOL003', schoolName: 'St. Marys Academy', status: 'Active', assignedDate: '2026-03-01' },
  ],

  feeRecords: [
    { id: 'FEE-101', roll: 'S101', name: 'Aishwarya Kumar', class: 'Grade 10-A', parent: 'Ramesh Kumar', phone: '+91 98456 12301', totalFee: '₹28,000', paid: '₹28,000', due: '₹0', status: 'PAID', invoiceNumber: 'INV-2026-001', dueDate: '2026-10-15' },
    { id: 'FEE-102', roll: 'S102', name: 'Kavitha Selvam', class: 'Grade 10-A', parent: 'Selvam Murugan', phone: '+91 98456 12302', totalFee: '₹26,000', paid: '₹16,000', due: '₹10,000', status: 'PARTIAL', invoiceNumber: 'INV-2026-002', dueDate: '2026-10-15' },
    { id: 'FEE-103', roll: 'S103', name: 'Sandhya Ramesh', class: 'Grade 10-A', parent: 'Ramesh Krishnan', phone: '+91 98456 12303', totalFee: '₹28,500', paid: '₹0', due: '₹28,500', status: 'OVERDUE', invoiceNumber: 'INV-2026-003', dueDate: '2026-10-10' },
    { id: 'FEE-104', roll: 'S104', name: 'Deepa Venkatesh', class: 'Grade 10-A', parent: 'Venkatesh S.', phone: '+91 98456 12304', totalFee: '₹28,000', paid: '₹28,000', due: '₹0', status: 'PAID', invoiceNumber: 'INV-2026-004', dueDate: '2026-10-20' },
    { id: 'FEE-105', roll: 'S105', name: 'Meena Natarajan', class: 'Grade 10-A', parent: 'Natarajan M.', phone: '+91 98456 12305', totalFee: '₹23,000', paid: '₹11,500', due: '₹11,500', status: 'PARTIAL', invoiceNumber: 'INV-2026-005', dueDate: '2026-10-15' },
    { id: 'FEE-106', roll: 'S106', name: 'Pooja Sundaram', class: 'Grade 10-B', parent: 'Sundaram P.', phone: '+91 98456 12306', totalFee: '₹28,000', paid: '₹28,000', due: '₹0', status: 'PAID', invoiceNumber: 'INV-2026-006', dueDate: '2026-10-15' },
    { id: 'FEE-107', roll: 'S107', name: 'Swathi Rajesh', class: 'Grade 10-B', parent: 'Rajesh K.', phone: '+91 98456 12307', totalFee: '₹28,000', paid: '₹20,000', due: '₹8,000', status: 'PARTIAL', invoiceNumber: 'INV-2026-007', dueDate: '2026-10-15' },
    { id: 'FEE-108', roll: 'S108', name: 'Bhavani Chandran', class: 'Grade 9-A', parent: 'Chandran M.', phone: '+91 98456 12308', totalFee: '₹26,000', paid: '₹26,000', due: '₹0', status: 'PAID', invoiceNumber: 'INV-2026-008', dueDate: '2026-10-15' },
  ]
};

const STORAGE_KEY = 'ssv_demo_data';

export function getPortalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.staffLeaves || parsed.staffLeaves.length === 0) {
        parsed.staffLeaves = defaultData.staffLeaves;
      }
      if (!parsed.nonTeachingStaff || parsed.nonTeachingStaff.length === 0) {
        parsed.nonTeachingStaff = defaultData.nonTeachingStaff;
      }
      if (!parsed.operationsWorks || parsed.operationsWorks.length === 0) {
        parsed.operationsWorks = defaultData.operationsWorks;
      }
      if (!parsed.principals || parsed.principals.length === 0) {
        parsed.principals = defaultData.principals;
      }
      if (!parsed.subjects || parsed.subjects.length < defaultData.subjects.length) {
        parsed.subjects = defaultData.subjects;
      }
      if (!parsed.classTimetables || parsed.classTimetables.length < defaultData.classTimetables.length) {
        parsed.classTimetables = defaultData.classTimetables;
      }
      if (!parsed.announcements || parsed.announcements.length === 0 || !parsed.announcements[0].image) {
        parsed.announcements = defaultData.announcements;
      }
      if (!parsed.exams || parsed.exams.length === 0) {
        parsed.exams = defaultData.exams;
      }
      if (!parsed.studyMaterials || parsed.studyMaterials.length === 0) {
        parsed.studyMaterials = defaultData.studyMaterials;
      }
      if (!parsed.attendanceLogs || parsed.attendanceLogs.length === 0) {
        parsed.attendanceLogs = defaultData.attendanceLogs;
      }
      if (!parsed.feeRecords || parsed.feeRecords.length === 0) {
        parsed.feeRecords = defaultData.feeRecords;
      }
      if (parsed.students && parsed.students.length > 0) {
        parsed.students = parsed.students.map((s) => {
          const match = defaultData.students.find((ds) => ds.roll === s.roll);
          return {
            ...s,
            parentName: s.parentName || (match ? match.parentName : 'Mr. Parent Guardian'),
            parentPhone: s.parentPhone || (match ? match.parentPhone : '+91 98401 22334')
          };
        });
      }
      return { ...defaultData, ...parsed };
    }
  } catch (err) {
    console.warn('Portal data parsing error:', err);
  }
  return defaultData;
}

export function savePortalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portal_data_updated', { detail: data }));
    }
  } catch (err) {
    console.error('Portal data saving error:', err);
  }
}


export function syncBillToPortalFeeRecords(bill) {
  if (!bill) return;
  try {
    const cur = getPortalData();
    let records = Array.isArray(cur.feeRecords) ? [...cur.feeRecords] : [...defaultData.feeRecords];
    const billRoll = bill.rollNo || bill.studentId;
    const billInv = bill.invoiceNumber;

    const idx = records.findIndex(r => (billInv && r.invoiceNumber === billInv) || (billRoll && r.roll === billRoll));

    const totalAmt = Number(bill.totalFees) || 0;
    const paidAmt = Number(bill.paidAmount) || 0;
    const dueAmt = Math.max(0, totalAmt - paidAmt);
    const statusUpper = dueAmt === 0 ? 'PAID' : (paidAmt > 0 ? 'PARTIAL' : 'OVERDUE');

    const mapped = {
      id: bill._id || `FEE-${billRoll || Date.now()}`,
      roll: billRoll || 'S101',
      name: bill.studentName,
      class: `${bill.grade || 'Grade 10'}-${bill.section || 'A'}`,
      parent: bill.parentName || 'Parent / Guardian',
      phone: bill.parentPhone || '+91 98456 12301',
      totalFee: `₹${totalAmt.toLocaleString('en-IN')}`,
      paid: `₹${paidAmt.toLocaleString('en-IN')}`,
      due: `₹${dueAmt.toLocaleString('en-IN')}`,
      status: statusUpper,
      invoiceNumber: bill.invoiceNumber,
      dueDate: bill.dueDate || '2026-10-15',
      billingMonth: bill.billingMonth || 'October',
      feeItems: bill.feeItems || []
    };

    if (idx !== -1) {
      records[idx] = { ...records[idx], ...mapped };
    } else {
      records.unshift(mapped);
    }

    cur.feeRecords = records;
    savePortalData(cur);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fee_records_updated', { detail: { bill, feeRecords: records } }));
    }
  } catch (e) {
    console.warn('syncBillToPortalFeeRecords error:', e);
  }
}

export function getInitialPortalData() {
  const data = getPortalData();
  savePortalData(data);
  return data;
}

