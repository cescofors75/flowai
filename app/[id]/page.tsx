'use client'

import { useEffect, useState } from 'react';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import AssistantPopover from '../components/AssistantPopover';

type Business = {
  name: string;
  id: string;
  city: string;
  products: string;
  mail: string;
  es: string;
};

export default function PostPage({ params }: { params: Params }) {
  const [postId, setPostId] = useState('');
  const [business, setBusiness] = useState<Business[]>([]);

  const getBusiness = async () => {
    try {
      if (params.id) {
        setPostId(params.id);

        const response = await fetch(`../api/supabase/getBusiness`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nameNoSpace: params.id })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        //console.log(data.data);
        // Check if data is an array
        
          setBusiness(data.data);
      
      }
    } catch (e) {
      // Catch any errors during the fetch process
     
    }
  };
 

  useEffect(() => {
    

    getBusiness();
  }, [params]);

  return (
    <div>
      <div>The ID of this post is: {postId}</div>
      
      { business.map((bus) => (
        <div key={bus.id}>
          <h3>{bus.name}</h3>
          <p>{bus.city}</p>
          <p>{bus.products}</p>
          <p>{bus.mail}</p>
         

          {/* Additional business details can be added here */}
        </div>
      ))}
      <AssistantPopover />
    </div>
  );
}
