import { hash } from 'bcryptjs';
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// Local JSON file-based user storage (replaces @vercel/postgres for local development)
const USERS_FILE = path.join(process.cwd(), 'users.json');

function getUsers(): Array<{ email: string; password: string; answer: string; id: number }> {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  return [];
}

function saveUsers(users: Array<{ email: string; password: string; answer: string; id: number }>) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function POST(req: Request) {
  try {
    const { email, password, answer } = await req.json();
    console.log({ email, password, answer });

    const users = getUsers();

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      answer,
    };

    users.push(newUser);
    saveUsers(users);

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}