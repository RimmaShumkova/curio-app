export async function loginWithGoogleApi(token: string) {
  const res = await fetch("http://10.0.2.2:3000/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  });

  if (!res.ok) {
    throw new Error("Auth failed");
  }

  return res.json();
}
