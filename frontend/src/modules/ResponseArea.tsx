import { useState } from "react";

function ResponseArea() {
    const [ code, setCode ] = useState<HTMLElement | null>(null);

    return(
        <div className="response-area-container">
            {
                code === null ? (
                    <div className="response-area" />
                ) : (
                    <textarea className="response-area" />
                )
            }
        </div>
    );
}

export default ResponseArea;