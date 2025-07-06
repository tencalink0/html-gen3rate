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

    const submitPrompt = async (prompt: string) => {
        setResponses(prevResponses => [
            ...(prevResponses ?? []),
            [prompt, ResponseStatus.Processing, ''] as [string, ResponseStatus, string]
        ]);

        try {
            const res = await fetch('/api/chatbot', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: prompt }]
                })
            });

            const data = await res.json();
            const aiContent = data.choices?.[0]?.message?.content || "No reply";

            setResponses(prevResponses => {
                if (!prevResponses) return null;

                const updated = [...prevResponses];
                const lastIndex = updated.length - 1;

                updated[lastIndex] = [
                    updated[lastIndex][0],
                    ResponseStatus.Completed,
                    aiContent
                ];

                return updated;
            });
        } catch (error: any) {
            setResponses(prevResponses => {
                if (!prevResponses) return null;

                const updated = [...prevResponses];
                const lastIndex = updated.length - 1;

                updated[lastIndex] = [
                    updated[lastIndex][0],
                    ResponseStatus.Failed,
                    error.message ?? String(error)
                ];

                return updated;
            });
        }
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