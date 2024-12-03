import React from 'react'
import Peopleform from '../_components/peopleform'
import InviteUser from '../_components/InviteUser'



export default function page() {
  return (
    <div>
      <div className='flex justify-end mb-5'>
      <InviteUser/>
      </div>
       <Peopleform/>
    </div>
  )
}
