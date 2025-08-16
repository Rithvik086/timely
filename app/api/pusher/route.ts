import { timeStamp } from "console";
import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || "",
    key: process.env.PUSHER_APP_KEY || "",
    secret: process.env.PUSHER_APP_SECRET || "",
    cluster: process.env.PUSHER_APP_CLUSTER || "",
    useTLS: true
})

export async function POST(req: Request) {

    try {
        const body = await req.json();
        const { userId, lat, lon } = body;

        await pusher.trigger("locations", "location-update", {
            userId,
            lat,
            lon,
            timestamp: new Date().toISOString()
        })
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: "Internal Server Error" })
    }
}