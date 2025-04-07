import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with empty transactions
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        settings: {
          create: {
            theme: "light",
            currency: "USD",
            notificationsEnabled: true,
          },
        },
        categories: {
          createMany: {
            data: [
              { name: "Food", color: "#4CAF50", icon: "utensils" },
              { name: "Transportation", color: "#2196F3", icon: "car" },
              { name: "Entertainment", color: "#E91E63", icon: "film" },
              { name: "Utilities", color: "#673AB7", icon: "bolt" },
              { name: "Housing", color: "#FF5722", icon: "home" },
              { name: "Health", color: "#00BCD4", icon: "heart" },
              { name: "Education", color: "#9C27B0", icon: "book" },
              { name: "Other", color: "#607D8B", icon: "folder" },
            ]
          }
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        user,
        message: "User registered successfully",
        isNewUser: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 