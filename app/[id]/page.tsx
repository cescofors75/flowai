'use client'

import { useEffect, useState } from 'react';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import AssistantPopover from '../components/AssistantPopover';
import { getBusiness } from '../functions/supabase'




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
 



  async function  getBusinessI(id: string)  {
    const dataBusiness = await getBusiness(id)
    return (dataBusiness)
    }

  useEffect(() => {
    
    setPostId(params.id)
    
    getBusinessI(params.id ).then((data) => {
    setBusiness(data)
    })


  }, [params]);

  return (
    <div>
      <div>The ID of this post is: {postId}
      <br/>
      **************************
      <br/>
         
      {business &&  business.map((bus) => (
        <div key={bus.id}>
          <h3>{bus.name}</h3>
          <p>{bus.city}</p>
          <p>{bus.products}</p>
          <p>{bus.mail}</p>
         
         
        </div>
      ))} 
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