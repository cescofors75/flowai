

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
async function fetchGetBusiness(id: string) {
  
  const res = await fetch("../api/supabaseGetBusiness", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const data = await res.json();
  return data;
}


export async function  getBusiness(id: string)  {
  const dataBusiness = await fetchGetBusiness(id)
  return (dataBusiness)
  }
