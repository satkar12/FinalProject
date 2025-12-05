import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class helper
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Example: fetch users from backend
export async function getUsers() {
    try {
        const res = await fetch(`${apiUrl}/users`);
        if (!res.ok) {
            throw new Error(`Request failed: ${res.status}`);
        }
        return res.json();
    } catch (err) {
        console.error("❌ Error fetching users:", err);
        return [];
    }
}
