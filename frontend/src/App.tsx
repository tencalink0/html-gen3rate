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

    const _submitPrompt = async (prompt: string) => {
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

    console.log(_submitPrompt);

    const submitPrompt = async (prompt: string) => {
        setResponses(prevResponses => [
            ...(prevResponses ?? []),
            [prompt, ResponseStatus.Completed, `
                I'd be happy to help you create a webpage. However, I'm a large language model, I don't have the capability to directly create a webpage that you can access online. But I can guide you through the process and provide you with the necessary code and instructions to create a simple webpage. Here's what I can do: 1. **Provide HTML, CSS, and JavaScript code**: I can give you the code for a basic webpage, including HTML for structure, CSS for styling, and JavaScript for interactivity. 2. **Explain the code and its functionality**: I can help you understand what the code does and how to modify it to suit your needs. 3. **Suggest a simple webpage design**: I can propose a simple design for your webpage, including layout, colors, and other visual elements. To get started, can you please provide me with some more information about the webpage you want to create? For example: * What is the purpose of the webpage (e.g., personal, business, informational)? * What content do you want to include (e.g., text, images, links, forms)? * Do you have any specific design or branding requirements (e.g., colors, fonts, logos)? Let's chat, and I'll help you create a simple webpage.    
            `] as [string, ResponseStatus, string]
        ]);
    }

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