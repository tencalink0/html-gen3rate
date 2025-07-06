import { useEffect, useRef, useState } from "react";

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

function ResponseArea() {
    const [ code, _setCode ] = useState<HTMLElement | null>(null);
    const [ responses , _setResponses ] = useState<string[]>([]);
    const [ creationSuggestion, setCreationSuggestion ] = useState<string>('');
    const typingInterval = useRef<number | null>(null);
    const deletingInterval = useRef<number | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        toggleSuggestion(true);
    }, []);

    const toggleSuggestion = (generate: boolean) => {
        if (responses.length > 0) return;
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

    return(
        <div className="response-area-container">
            {
                code === null ? (
                    <div className="response-area">
                        {
                            responses.length === 0 ? (
                                <div className="quick-center">
                                    <h2 className="prompt-suggestion">
                                        Create a <span style={{
                                            color: 'var(--blue)'
                                        }}>{creationSuggestion}</span>
                                    </h2>
                                </div>
                            ) : (
                                <></>
                            )
                        }
                    </div>
                ) : (
                    <textarea className="response-area" />
                )
            }
        </div>
    );
}

export default ResponseArea;