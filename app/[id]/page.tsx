"use client";

import { useEffect, useState } from "react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import {AssistantPopover} from "../components/AssistantPopover";
import { getBusiness } from "../functions/supabase";

type Business = {
  name: string;
  id: string;
  city: string;
  products: string;
  mail: string;
  es: string;
};

export default function PostPage({ params }: { params: Params }) {
  const [postId, setPostId] = useState("");
  const [business, setBusiness] = useState<Business>();

  useEffect(() => {
    setPostId(params.id);

    getBusiness(params.id).then((data) => {
      setBusiness(data);
    });
  }, [params]);

  return (
    <div>
      <div>
        The ID of this post is: {postId}
        <br />
        ****************************************************
        <br />
        Busines info:
        {business && (
          <div>
            <h3>{business.name}</h3>
            <p>{business.city}</p>
            <p>{business.products}</p>
            <p>{business.mail}</p>
          </div>
        )}
      </div>

      <AssistantPopover />
    </div>
  );
}
/*   const getLocal = async () => {
    try {
      const data = await fetch('../api/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
      }).then((res) => res.json())
      
      console.log(data)
      setLocal(data.responseMistral)
    } catch (error) {
      console.log(error)
    }

  }; */
