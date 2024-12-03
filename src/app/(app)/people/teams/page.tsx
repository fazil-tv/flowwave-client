"use client"
import React, { useState } from 'react'
import { AddTeam } from './_components/addteam'

import TeamCard from './_components/teamview';



function page() {

  return (
    <div>
      <div className='flex justify-end mb-5'>
        <AddTeam />
      </div>
      <div>
        <TeamCard />
      </div>
    </div>
  )
}

export default page