import { useEffect, useState} from "react";
import { ResponseStatus } from "../App";

import ResponseArea from './ResponseArea';

import SendIcon from '../assets/send.png';

function ChatArea({
    isMobile,
    responses,
    submitPrompt
}: {
    isMobile: boolean,
    responses: [string, ResponseStatus, string][] | null,
    submitPrompt: (prompt: string) => void
}) {
    const [ prompt, setPrompt ] = useState<string>('');

    useEffect(() => {
        console.log(isMobile);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    };

    return(
        <div className='chat-area'>
            <ResponseArea responses={responses}/>
            <div className='prompt-box'>
                <textarea 
                    className='inputbox'
                    onChange={handleChange}
                />
                <button 
                    className="prompt-submit quick-center"
                    onClick={() => submitPrompt(prompt)}
                >
                    <img src={SendIcon}/>
                </button>
            </div>
        </div>
    );
}

export default ChatArea;