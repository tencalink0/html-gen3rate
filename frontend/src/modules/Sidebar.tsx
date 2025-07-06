import type { Dispatch, SetStateAction } from 'react';
import HamburgerImage from '../assets/hamburger.png';

function Sidebar({
    isMobile,
    sidebarVisible,
    setSidebarVisible
} : {
    isMobile: boolean,
    sidebarVisible: boolean,
    setSidebarVisible: Dispatch<SetStateAction<boolean>>
}) {
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible)
    }

    return(
        <>
            <div className="sidebar" style={{
                width: sidebarVisible ? '20%' : '60px'
            }}>
                {
                    isMobile || !sidebarVisible ? (
                        <h2>G<span style={{
                            color: 'var(--blue)'
                        }}>3</span></h2>
                    ) : (
                        <h2>Gen<span style={{
                            color: 'var(--blue)'
                        }}>3</span>rate</h2>
                    )
                }
                <div className='icon-container'>
                     <img 
                        className='icon'
                        src={HamburgerImage}
                        onClick={toggleSidebar}
                    />
                </div>
            </div>
        </>
    );
}

export default Sidebar;