import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
const AppLayout = () => {
  return (
    <div>
        <main className='min-h-screen container'>
          <Header/>          
          <Outlet/>
        </main>

        <div className='p-10 text-center bg-gray-800 mt-10'>
          Made with ❤️ by Udanth
        </div>

    </div>
  )
}

export default AppLayout
