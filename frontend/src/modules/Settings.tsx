import { version } from "../App";
import { useState, useEffect } from "react";

function Settings() {
    const [wrapper, setWrapper] = useState(() => {
        return localStorage.getItem('wrapper') || 'html';
    });

    useEffect(() => {
        localStorage.setItem('wrapper', wrapper);
    }, [wrapper]);

    return(
        <div
            style={{
                gap: '2.5%',
            }} 
            className="chat-area"
        >
            <h1 style={{marginTop: '0'}}>Settings</h1>
            <div
                style={{
                    padding: '2.5%'
                }} 
                className="settings-area"
            >
                <div className="option">
                    <h2>Wrapper:</h2>
                    <select value={wrapper} onChange={(e) => setWrapper(e.target.value)}>
                        <option value="html">HTML</option>
                        <option value="html2">HTML2</option>
                        <option value="htmlpro">HTMLPro (pre)</option>
                        <option value="chat">Chat (no html)</option>
                    </select>
                </div>
                <div className="option">
                    <h2>Version: <span style={{
                        color: 'var(--blue)'
                    }}>{version}</span></h2>
                </div>
                <div className="option">
                    <h3>Tip: if you keep getting invalid data from the AI, type:&nbsp;
                        <span style={{
                            color: 'var(--blue)'
                        }}>Force JSON response</span>
                    </h3>
                </div>
                <div className="option" style={{
                    position: 'absolute',
                    bottom: '5%'
                }}>
                    <h3>Check out my other projects here: <a
                        href="https://github.com/tencalink0?tab=repositories"
                        target="_blank"
                    >tencalink0</a></h3>
                </div>
            </div>
        </div>
    )
}

export default Settings;