import React from 'react'
import axios from "axios";
import { BACKEND_URL } from '../../config';

const GetRoom = ({
    params
}: {
    params:{
        slug: string
    }
}) => {
    
    const slug = params.slug;



  return (
    <div>GetRoom</div>
  )
}

export default GetRoom;