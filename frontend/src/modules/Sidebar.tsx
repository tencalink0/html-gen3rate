import type { Dispatch, SetStateAction } from 'react';
import HamburgerIcon from '../assets/hamburger.png';
import SettingsIcon from '../assets/setting.png';
import NightIcon from '../assets/night-mode.png';

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
                width: isMobile || !sidebarVisible ? '60px' : '20%'
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
                <div 
                    className='icon-container'
                    style={{
                        flexDirection: isMobile || !sidebarVisible ? 
                            'column' : 'row'
                    }}
                >
                    <img 
                        className='icon'
                        src={HamburgerIcon}
                        onClick={toggleSidebar}
                    />
                    <img 
                        className='icon'
                        src={NightIcon}
                    />
                    <img 
                        className='icon'
                        src={SettingsIcon}
                    />
                </div>
            </div>
        </>
    );
}

export default Sidebar;