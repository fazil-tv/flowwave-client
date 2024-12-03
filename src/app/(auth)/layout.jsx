import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="layout !overflow-hidden">
              <main className='bg-gradient-to-tr from-[#100730] from-0% via-black via-30% to-[#100730] to-100% h-screen'>
                {children}
            </main>
        </div>
    );
};

export default Layout;
