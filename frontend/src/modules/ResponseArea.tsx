import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { ResponseStatus } from "../App";
//import DOMPurify from 'dompurify';

import AiIcon from '../assets/ai.png';
import ErrorIcon from '../assets/close.png';
import CloseBtn from '../assets/close.svg';
import DownloadBtn from '../assets/download-code.png';

const suggestions = [
    'website for your startup',
    'website for a friend',
    'basic boilerplate for your project',
    'simple portfolio page',
    'landing page for a product',
    'personal blog template',
    'responsive business homepage',
    'one-page event invitation',
    'minimalist photography gallery',
    'interactive resume page',
    'e-commerce product showcase',
    'newsletter signup page',
    'company team introduction',
    'FAQ section template',
    'contact form with validation'
];

const TYPING_SPEED = 50; // char per sec
const WORD_TIMEOUT = 1300; // ms

export const ResponseJsonSchema = z.object({
    response: z.string(),
    description: z.string().optional(),
    html: z.string()
});

export type ResponseJson = z.infer<typeof ResponseJsonSchema>;

function ResponseArea({
    responses,
    setCodeTitle
} : {
    responses: [string, ResponseStatus, ResponseJson | string][] | null,
    setCodeTitle: (codeTitle?: string) => void
}) {
    const [ code, setCode ] = useState<string | null>(null);
    const [ creationSuggestion, setCreationSuggestion ] = useState<string>('');
    const typingInterval = useRef<number | null>(null);
    const deletingInterval = useRef<number | null>(null);
    const [ busy, setBusy ] = useState(false);
    const [ dotCount, setDotCount ] = useState(1);

    useEffect(() => {
        toggleSuggestion(true);

        const interval = setInterval(() => {
            setDotCount((prev) => (prev % 3) + 1);
        }, 150);

        return () => clearInterval(interval);
    }, []);

    const toggleSuggestion = (generate: boolean) => {
        if (responses !== null) return;
        if (generate) {
            const id = Math.floor(Math.random() * suggestions.length);
            typeSuggestion(id);
        } else {
            clearSuggestion();
        }
    }

    const typeSuggestion = (id: number) => {
        if (busy) return;
        setBusy(true);
        let characterCount = 0;
        if (typingInterval.current) clearInterval(typingInterval.current);

        typingInterval.current = window.setInterval(() => {
            if (characterCount > suggestions[id].length) {
                clearInterval(typingInterval.current!);
                typingInterval.current = null;
                setTimeout(() => {
                    setBusy(false);
                    toggleSuggestion(false);
                }, WORD_TIMEOUT);
            } else {
                setCreationSuggestion(suggestions[id].substring(0, characterCount));
                characterCount++;
            }
        }, 1000 / TYPING_SPEED);
    };

    const clearSuggestion = () => {
        if (busy) return;
        setBusy(true);
        if (deletingInterval.current) clearInterval(deletingInterval.current);

        deletingInterval.current = window.setInterval(() => {
            setCreationSuggestion(prev => {
                if (prev.length === 0) {
                    clearInterval(deletingInterval.current!);
                    deletingInterval.current = null;
                    setTimeout(() => {
                    setBusy(false);
                    toggleSuggestion(true);
                    }, WORD_TIMEOUT / 2);
                    return "";
                }
                return prev.substring(0, prev.length - 1);
            });
        }, 1000 / TYPING_SPEED);
    };

    const loadCode = (newCode: string, newTitle?: string) => {
        //const sanitizedCode = DOMPurify.sanitize(newCode);
        const sanitizedCode = newCode;

        setCodeTitle(newTitle);
        setCode(
            sanitizedCode
        );
    }

    const closePage = () => {
        setCodeTitle(undefined);
        setCode(null);
    };

    const downloadCode = (codeDownload: string, title?: string) => {
        const blob = new Blob([codeDownload], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;

        const kebab = (title || 'download').toLowerCase().replace(/\s+/g, '-');
        a.download = `${kebab}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return(
        <div className="response-area-container">
            {
                code === null ? (
                    <div className="response-area">
                        {
                            responses === null ? (
                                <div className="quick-center">
                                    <h2 className="prompt-suggestion">
                                        Create a <span style={{
                                            color: 'var(--blue)'
                                        }}>{creationSuggestion}</span>
                                    </h2>
                                </div>
                            ) : (
                                <div className="response-collection">
                                    {
                                        responses.map((response, index) => (
                                            <div className="response-line-container" key={index}>
                                                <div className="response-line">
                                                    <img className='profile-icon' src={
                                                        response[1] === ResponseStatus.Failed ? ErrorIcon : AiIcon
                                                    }/>
                                                    <p className={`response-line-text ${
                                                        response[1] === ResponseStatus.Failed ? 'error' : ''
                                                    }`}>
                                                        {
                                                            response[1] === ResponseStatus.Processing 
                                                                ? '.'.repeat(dotCount)
                                                            : <>
                                                                { response[1] === ResponseStatus.Failed ? 'Error: ' : '' }
                                                                {
                                                                    ResponseJsonSchema.safeParse(response[2]).success ?
                                                                        (response[2] as ResponseJson).response :
                                                                        response[2]
                                                                }
                                                            </>
                                                        }
                                                    </p>
                                                </div>
                                                {
                                                    ResponseJsonSchema.safeParse(response[2]).success ?
                                                        <div className="response-interaction">
                                                            <a 
                                                                className="highlight-text"
                                                                onClick={() => loadCode(
                                                                    (response[2] as ResponseJson).html,
                                                                    (response[2] as ResponseJson).description
                                                                )}
                                                            >Preview</a>
                                                            <img 
                                                                src={DownloadBtn}
                                                                className="download"
                                                                onClick={() => downloadCode(
                                                                    (response[2] as ResponseJson).html,
                                                                    (response[2] as ResponseJson).description
                                                                )}
                                                            />
                                                        </div>
                                                        : ''
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div
                        className="page-display-wrapper"
                    >
                        <iframe
                            className="page-display"
                            srcDoc={code}
                        />
                        <img 
                            src={CloseBtn} 
                            className="close-btn"
                            onClick={closePage}
                        />
                    </div>
                )
            }
        </div>
    );
}

export default ResponseArea;