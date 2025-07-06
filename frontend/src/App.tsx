import './App.css'
import Sidebar from './modules/Sidebar';
import ResponseArea from './modules/ResponseArea';

function App() {
    return (
        <main>
            <Sidebar />
            <div className='chat-area'>
                <ResponseArea />
                <div className='chat-box'>
                    <textarea className='inputbox'/>
                </div>
            </div>
        </main>
    );
}

export default App;