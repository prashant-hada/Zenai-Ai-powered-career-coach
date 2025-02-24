import { cookies } from 'next/headers';
import { getUserOnboardingStatus } from '@/lib/function'
import { NextResponse } from 'next/server';

export async function GET() {
    console.log("funtion start...................................")
    const isOnboardedCookie = (await cookies()).get("isOnboarded")?.value;
    if (isOnboardedCookie === 'yell') {
        return NextResponse.json({ isOnboarded: true });
    }
    console.log("funtion mid...................................")
    const isOnboarded = await getUserOnboardingStatus();
    console.log("funtion mid2...................................")
    if (isOnboarded) {
        console.log("funtion mid3...................................")
        const response = NextResponse.json({ isOnboarded: true });
        console.log("funtion mid4...................................")
        response.cookies.set('isOnboarded', 'true', { maxAge: 60 * 60});

        return response;
    }
    console.log("funtion end DDDD...................................")
    return NextResponse.json({ isOnboarded: false });
}