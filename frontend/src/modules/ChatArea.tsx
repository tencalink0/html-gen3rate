import { useEffect, useState} from "react";
import { ResponseStatus } from "../App";

import ResponseArea, { type ResponseJson } from './ResponseArea';

import SendIcon from '../assets/send.png';

function ChatArea({
    isMobile,
    responses,
    submitPrompt
}: {
    isMobile: boolean,
    responses: [string, ResponseStatus, ResponseJson | string][] | null,
    submitPrompt: (prompt: string) => void
}) {
    const [ prompt, setPrompt ] = useState<string>('');
    const [ codeTitle, setCodeTitle ] = useState<string | undefined>(undefined)
    
    useEffect(() => {
        console.log(isMobile);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    };

    const handleSubmit = () => {
        if (prompt.trim() === '') return;
        submitPrompt(prompt);
        setPrompt('');
    };

    return(
        <div className='chat-area'>
            <h1>
                {
                    codeTitle === undefined ?
                        'Chat Area' :
                        codeTitle
                }
            </h1>
            <ResponseArea 
                responses={responses}
                setCodeTitle={setCodeTitle}
            />
            <div className='prompt-box'>
                <textarea 
                    className='inputbox'
                    value={prompt}
                    onChange={handleChange}
                />
                <button 
                    className="prompt-submit quick-center"
                    onClick={handleSubmit}
                >
                    <img src={SendIcon}/>
                </button>
            </div>
        </div>
    );
}

export default ChatArea;