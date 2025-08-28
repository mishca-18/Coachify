import React, { Suspense } from 'react';
import { BeatLoader } from "react-spinners";

const Layout = ({ children }) => {
    return (
        <div className='px-5'>
            <Suspense fallback = {<BeatLoader className='flex justify-center  mt-4' width={"100%"} color='gray' />} >
                {children}
            </Suspense>
            

        </div>
    );
};

export default Layout;