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
export async function getBusiness(id) {
  console.log("id", id);
  const res = await fetch("../api/supabaseGetBusiness", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const data = await res.json();
  console.log("data", data);

  return data;
}
