import { useEffect, type Dispatch, type SetStateAction } from 'react';
import HamburgerIcon from '../assets/hamburger.png';
import SettingsIcon from '../assets/setting.png';
import NightIcon from '../assets/night-mode.png';

function Sidebar({
    isMobile,
    sidebarVisible,
    setSidebarVisible,
    settingState,
    setSettingState,
    darkMode,
    setDarkMode
} : {
    isMobile: boolean,
    sidebarVisible: boolean,
    setSidebarVisible: Dispatch<SetStateAction<boolean>>,
    settingState: boolean,
    setSettingState: Dispatch<SetStateAction<boolean>>,
    darkMode: boolean, 
    setDarkMode: Dispatch<SetStateAction<boolean>>
}) {
    useEffect(() => {

    });

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible)
    };

    const toggleSettings = () => {
        setSettingState(!settingState);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem(
            'nightmode', 
            !darkMode ? 'true' : 'false'
        );
    };

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
                        onClick={toggleDarkMode}
                    />
                    <img 
                        className='icon'
                        src={SettingsIcon}
                        onClick={toggleSettings}
                    />
                </div>
            </div>
        </>
    );
}

export default Sidebar;