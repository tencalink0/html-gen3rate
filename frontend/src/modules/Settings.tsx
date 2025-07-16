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
                    </select>
                </div>
            </div>
        </div>
    )
}

export default Settings;