//import React from 'react'

export async function businessList() {
  const res = await fetch("../api/supabase", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const data = await res.json();

  return data;
}
