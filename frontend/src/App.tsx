import Sidebar from './modules/Sidebar';
import ChatArea from './modules/ChatArea';

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import './App.css';
import { ResponseJsonSchema, type ResponseJson } from './modules/ResponseArea';
import Settings from './modules/Settings';

export const ResponseStatus = {
    Processing: "processing",
    Completed: "completed",
    Failed: "failed",
} as const;
export type ResponseStatus = typeof ResponseStatus[keyof typeof ResponseStatus];

export const version = '0.1.1';

const colorStates = [
    ['--white', '#fff', '#333'],
    ['--grey', '#333', '#aaa'],
    ['--grey-light', '#444', '#ccc'],
    ['--grey-light-light', '#555', '#bbb'],
    ['--icon-inversion', 'invert(1)', 'invert(0)']
];

function keepFunc(func: any) {
    if (func.hello) window.innerWidth;
}

// lifesaver
function cleanJsonPrefix(rawString: string): string {
    const firstBraceIndex = rawString.indexOf('{');
    if (firstBraceIndex === -1) return rawString;

    const prefix = rawString.slice(0, firstBraceIndex).toLowerCase();
    if (prefix.includes('json')) {
        return rawString.slice(firstBraceIndex);
    }

    return rawString;
}

const submitPrompt = async (
    prompt: string,
    responses: [string, ResponseStatus, ResponseJson | string][] | null, 
    setResponses: Dispatch<SetStateAction<[string, ResponseStatus, ResponseJson | string][] | null>>
) => {
    setResponses(prevResponses => [
        ...(prevResponses ?? []),
        [prompt, ResponseStatus.Processing, ''] as [string, ResponseStatus, ResponseJson | string]
    ]);

    try {
        const bodyRes = [
            ...(responses ?? []), 
            [prompt, ResponseStatus.Completed, '']
        ].flatMap(([prompt, resStatus, response]) => 
            resStatus !== ResponseStatus.Failed ?
            [   
                { role: 'user', content: prompt }, 
                { role: 'assistant', content: response }
            ] :
            [
                { role: 'unknown', content: 'error'}
            ]
        );

        const res = await fetch('/api/chatbot', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: bodyRes,
                wrapper: localStorage.getItem('wrapper') || 'html'
            })
        });

        console.log(responses);
        console.log(bodyRes);

        const data = await res.json();
        const aiContent = await data.choices?.[0]?.message?.content || "No reply";

        if (data.error) throw new Error(data.error);

        let jsonValid: string | null = null;
        try {
            const parsedStr = JSON.parse(
                cleanJsonPrefix(
                    aiContent
                ).replace(/`/g, '')
            );
            jsonValid = parsedStr;
        } catch (err: any) {
            console.error('Invalid data from the AI');
            if (err instanceof SyntaxError) {
                console.error('JSON parse error:', err.message);
                console.log('AI response:');
                console.log(aiContent.replace(/`/g, ''));
            }
        }

        let parsedResponse: ResponseJson | null = null;
        if (jsonValid) {
            const parsed = await ResponseJsonSchema.safeParseAsync(jsonValid);
            if (parsed.success) {
                parsedResponse = parsed.data;
            } else {
                console.error(parsed.error.issues);
            }
        }

        const successfulParse = jsonValid === null || parsedResponse === null ? false : true;
        const newResponse = [
            prompt, 
            successfulParse ? ResponseStatus.Completed : ResponseStatus.Failed, 
            successfulParse ? parsedResponse : 'Invalid data provided from the AI'
        ] as [string, ResponseStatus, ResponseJson | string]

        setResponses(prevResponses => {
            const responses = [...(prevResponses ?? [])];
            responses[responses.length - 1] = newResponse;
            return responses;
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

const _submitPrompt = async (
    prompt: string,
    responses: [string, ResponseStatus, ResponseJson | string][] | null, 
    setResponses: Dispatch<SetStateAction<[string, ResponseStatus, ResponseJson | string][] | null>>
) => {
    const aiContent = `
        { "response": "a", "description": "Omg", "html": "<!DOCTYPE html><html><head><title>Sleek Webpage</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0}header{background-color:#333;color:#fff;padding:1em;text-align:center}.container{display:flex;flex-direction:column;align-items:center;padding:2em}.card{background-color:#f7f7f7;padding:1em;margin:1em;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1)}</style></head><body><header><h1>Welcome to my Sleek Webpage</h1></header><div class='container'><div class='card'><h2>About Me</h2><p>This is a sample webpage.</p></div></div></body></html>" }
    `;

    let jsonValid: string | null = null;
    try {
        const parsedStr = JSON.parse(aiContent);
        jsonValid = parsedStr;
    } catch {
        console.error('Invalid data from the AI');
    }

    let parsedResponse: ResponseJson | null = null;
    if (jsonValid) {
        const parsed = await ResponseJsonSchema.safeParseAsync(jsonValid);
        if (parsed.success) {
            parsedResponse = parsed.data;
        } else {
            console.error(parsed.error.issues);
        }
    }

    const successfulParse = jsonValid === null || parsedResponse === null ? false : true;
    const newResponse = [
        prompt, 
        successfulParse ? ResponseStatus.Completed : ResponseStatus.Failed, 
        successfulParse ? parsedResponse : 'Invalid data provided from the AI'
    ] as [string, ResponseStatus, ResponseJson | string]

    console.log(responses);
    setResponses(prevResponses => [
        ...(prevResponses ?? []),
        newResponse
    ]);
}

keepFunc(_submitPrompt);


function App() {
    const [ isMobile, setIsMobile ] = useState<boolean>(window.innerWidth <= 770);
    const [ sidebarVisible, setSidebarVisible ] = useState<boolean>(false);
    const [ responses , setResponses ] = useState<[string, ResponseStatus, ResponseJson | string][] | null>(null);
    const [ settingState, setSettingState] = useState<boolean>(false);
    const [ darkMode, setDarkMode ] = useState<boolean>(true);
    const [ wrapperLabel, setWrapperLabel ] = useState<string>('HTML');
    
    useEffect(() => {
        if (localStorage.getItem('wrapper') === null) {
            localStorage.setItem('wrapper', 'html');
        }
        if (localStorage.getItem('nightmode') === null) {
            localStorage.setItem('nightmode', 'true');
        }
        setDarkMode(
            localStorage.getItem('nightmode') === 'true'
        );
        
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 770);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const rootStyle = document.documentElement.style;
        colorStates.forEach(color => {
            if (darkMode) {
                rootStyle.setProperty(
                    color[0],
                    color[1]
                );
            } else {
                rootStyle.setProperty(
                    color[0],
                    color[2]
                );
            }
        });
    }, [darkMode]);

    return (
        <>
            <div id="overlay"/>
            <h1 className='title'>Hey</h1>
            <button className='skip-intro'>Skip</button>
            <main>
                <Sidebar 
                    isMobile={isMobile}
                    sidebarVisible={sidebarVisible}
                    setSidebarVisible={setSidebarVisible}
                    settingState={settingState}
                    setSettingState={setSettingState}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />
                {
                    settingState ?
                    <Settings 
                        setWrapperLabel={setWrapperLabel}
                    /> :
                    <ChatArea
                        submitPrompt={(prompt: string) => {
                            submitPrompt(prompt, responses, setResponses)
                        }}
                        responses={responses}
                        wrapperLabel={wrapperLabel}
                    />
                }
            </main>
        </>
    );
}

export default App;