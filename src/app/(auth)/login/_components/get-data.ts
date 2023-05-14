"use client";
export async function getData() {
  const res = await fetch("http://localhost:3000/api/tutorial", {
    method: "GET",
    next: { revalidate: 5 },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
