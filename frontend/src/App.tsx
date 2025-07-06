import Sidebar from './modules/Sidebar';
import ChatArea from './modules/ChatArea';

import { useEffect, useState } from 'react';
import './App.css';

export const ResponseStatus = {
    Processing: "processing",
    Completed: "completed",
    Failed: "failed",
} as const;
export type ResponseStatus = typeof ResponseStatus[keyof typeof ResponseStatus];

function App() {
    const [ isMobile, setIsMobile ] = useState<boolean>(window.innerWidth <= 770);
    const [ sidebarVisible, setSidebarVisible ] = useState<boolean>(false);
    const [ responses , setResponses ] = useState<[string, ResponseStatus, string][] | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 770);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const submitPrompt = (prompt: string) => {
        setResponses([[prompt, ResponseStatus.Failed, 'No backend']])
    };

    return (
        <main>
            <Sidebar 
                isMobile={isMobile}
                sidebarVisible={sidebarVisible}
                setSidebarVisible={setSidebarVisible}
            />
            <ChatArea 
                isMobile={isMobile}
                submitPrompt={submitPrompt}
                responses={responses}
            />
        </main>
    );
}

export default App;