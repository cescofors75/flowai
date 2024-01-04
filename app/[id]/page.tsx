'use client'

import { useEffect, useState } from 'react';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import AssistantPopover from '../components/AssistantPopover';
//import { supabase } from '../supabase/client';

export const runtime = 'edge';

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
  const [local, setLocal] = useState('');
/*
  const getBusiness = async () => {
    try {
      if (params.id) {
        setPostId(params.id);

        const { data } = await supabase
        .from('bussines')
        .select('*')
        .eq('name_no_space', params.id.toLowerCase())

       
        
          setBusiness(data);
      
      }
    } catch (error) {
      // Catch any errors during the fetch process
      console.log(error);
    }
  };*/

  const getLocal = async () => {
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

  };
 

  useEffect(() => {
    setPostId(params.id);

   // getBusiness();
    getLocal()
  }, [params]);

  return (
    <div>
      <div>The ID of this post is: {postId}
      <br/>
      **************************
      <br/>
         
         {local}
         </div>
      
    
 
      <AssistantPopover />
    </div>
  );
}
/*  { business.map((bus) => (
        <div key={bus.id}>
          <h3>{bus.name}</h3>
          <p>{bus.city}</p>
          <p>{bus.products}</p>
          <p>{bus.mail}</p>
         
         
        </div>
      ))} */