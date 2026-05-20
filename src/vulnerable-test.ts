// VULNERABLE TEST CODE
// 1. SQL Injection (The agents should catch this)
export async function getUser(id: any) {
    const query = `SELECT * FROM users WHERE id = ${id}`;
    // ... execution code
}

// 2. Hardcoded Secret (Another easy win for the agents)
const apiKey = "AIzaSyD-12345-very-secret-key-that-should-not-be-here"