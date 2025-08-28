import React from 'react'
import ResumeScanner from './page'
import ResumeScannerCamera from './page'

const Layout = ({children}) => {
  return (
    <div className='flex flex-col  text-center space-y-9'>
        <ResumeScanner />
    </div>
  )
}

export default Layout
