import { useEffect, useState } from "react";
import { getUsers } from "../lib/utils";

export default function UsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers()
            .then((data) => {
                console.log("✅ Users from API:", data); // 👈 Debug
                setUsers(data);
            })
            .catch((err) => console.error("❌ Error in getUsers:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Users</h2>
            {users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <ul>
                    {users.map((u) => (
                        <li key={u.id}>{u.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
