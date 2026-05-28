import { NextResponse } from 'next/server';

// Mock database
const mockUsers = [
  {
    student_webmail: 'student@itum.mrt.ac.lk',
    password_hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // SHA-256 for 'password'
    firstName: 'Aruna',
    lastName: 'Perera',
    division: 'Division of Computer Engineering Technology'
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_webmail, password } = body;

    // 2) Validate that both fields are present
    if (!student_webmail || !password) {
      return NextResponse.json(
        { error: 'student_webmail and password are required' },
        { status: 400 }
      );
    }

    // 3) Implement a mock database lookup
    const user = mockUsers.find(u => u.student_webmail === student_webmail);

    // 4) If the user does not exist
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid Email or Password' },
        { status: 401 }
      );
    }

    // 5) If the user exists, check if their database password hash exactly matches the payload password hash
    if (user.password_hash !== password) {
      return NextResponse.json(
        { error: 'Invalid Email or Password' },
        { status: 401 }
      );
    }

    // 6) If they match, return a 200 OK response with mock user data
    return NextResponse.json(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        studentWebMail: user.student_webmail,
        division: user.division
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
