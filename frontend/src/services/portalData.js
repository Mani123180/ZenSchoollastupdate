// ============================================================================
// ZenSchool Master Portal Data Store (Exact parity with js/portal.js)
// Multi-Tenant RBAC & Live Data Synchronization
// ============================================================================

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
      marks: [
        { subject: 'Mathematics', max: 100, scored: 96, grade: 'A+' },
        { subject: 'Physics', max: 100, scored: 94, grade: 'A+' },
        { subject: 'Chemistry', max: 100, scored: 90, grade: 'A+' }
      ]
    }
  ],

  classes: [
    { name: 'Grade 10-A', teacher: 'Mrs. Priya Krishnan', strength: 38, room: 'A-102', schoolId: 'SCHOOL002' },
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
    { className: 'Grade 11-B', day: 'Friday', period: 3, subject: 'Computer Science', teacherName: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002' }
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
    { id: 'HW01', title: 'Algebra Equations Exercise', due: '2026-07-28', grade: 'Grade 10-A', subject: 'Mathematics', instructions: 'Solve exercises 3.1 to 3.4 in trigonometry notebook.', assignedBy: 'Mrs. Priya Krishnan', schoolId: 'SCHOOL002', assignedDate: '2026-07-20' },
    { id: 'HW02', title: 'Newtonian Laws Essay', due: '2026-07-30', grade: 'Grade 11-B', subject: 'Physics', instructions: 'Read chapter on kinetic energy laws and write 500 words essay.', assignedBy: 'Dr. Anandhi Rajan', schoolId: 'SCHOOL002', assignedDate: '2026-07-22' }
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
    { id: 'PAR002', name: 'Selvam Periasamy', relationship: 'Father', phone: '+91 98402 33445', email: 'selvam.p@gmail.com', studentName: 'Kavitha Selvam', studentRoll: 'S102', schoolId: 'SCHOOL002' }
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

  schoolServiceAssignments: [
    { id: 'SSA-01', serviceId: 'SRV-01', serviceName: 'Coding for Kids', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-01-15' },
    { id: 'SSA-02', serviceId: 'SRV-02', serviceName: 'Chess Academy', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-01-20' },
    { id: 'SSA-03', serviceId: 'SRV-03', serviceName: 'Robotics', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-02-01' },
    { id: 'SSA-04', serviceId: 'SRV-04', serviceName: 'Drawing & Art', schoolId: 'SCHOOL001', schoolName: 'ABC Matriculation School', status: 'Active', assignedDate: '2026-01-10' },
    { id: 'SSA-05', serviceId: 'SRV-05', serviceName: 'Spoken English', schoolId: 'SCHOOL001', schoolName: 'ABC Matriculation School', status: 'Inactive', assignedDate: '2026-01-12' },
    { id: 'SSA-06', serviceId: 'SRV-06', serviceName: 'Abacus & Vedic Maths', schoolId: 'SCHOOL003', schoolName: 'St. Marys Academy', status: 'Active', assignedDate: '2026-03-01' },
  ]
};

const STORAGE_KEY = 'ssv_demo_data';

export function getPortalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
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
  } catch (err) {
    console.error('Portal data saving error:', err);
  }
}

export function getInitialPortalData() {
  const data = getPortalData();
  savePortalData(data);
  return data;
}
