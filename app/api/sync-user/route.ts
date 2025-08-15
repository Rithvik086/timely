import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { auth0Id, email, name, role } = body;

        const user = await prisma.user.upsert(
            {
                where: { auth0Id },
                update: { email, name, role },
                create: { auth0Id, email, name, role }
            }
        )
         return NextResponse.json(user)

    } catch (err) {
        console.error("Error syncing user:", err);
        return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
    }
}