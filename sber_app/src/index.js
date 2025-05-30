import React from 'react';
import ReactDOM from 'react-dom/client'; // Или 'react-dom' для старых версий
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // <-- Импортируем BrowserRouter здесь

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter> {/* <-- Оборачиваем App в BrowserRouter здесь */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);