import Sidebar from './modules/Sidebar';
import ChatArea from './modules/ChatArea';

import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [ isMobile, setIsMobile ] = useState<boolean>(window.innerWidth <= 770);
    const [ sidebarVisible, setSidebarVisible ] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 770);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <main>
            <Sidebar 
                isMobile={isMobile}
                sidebarVisible={sidebarVisible}
                setSidebarVisible={setSidebarVisible}
            />
            <ChatArea isMobile={isMobile}/>
        </main>
    );
}

export default App;