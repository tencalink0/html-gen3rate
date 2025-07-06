import { useEffect } from 'react';
import ResponseArea from './ResponseArea';

function ChatArea({
    isMobile
}: {
    isMobile: boolean
}) {
    useEffect(() => {
        console.log(isMobile);
    }, []);
    return(
        <div className='chat-area'>
            <ResponseArea/>
            <div className='chat-box'>
                <textarea className='inputbox'/>
            </div>
        </div>
    );
}

export default ChatArea;