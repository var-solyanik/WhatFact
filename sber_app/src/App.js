import React, { useRef, useState, useEffect } from 'react';
import './style/style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GenreContext } from './hook/context';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';
import Game from './Components/Game';
import DifferentQuotes from './Components/DifferentFacts';
import Menu from './Components/Menu';
import { useSpatnavInitialization } from '@salutejs/spatial';

function App() {
    const [character, setCharacter] = useState('sber');
    const [genre, setGenre] = useState('country');
    const [modalState, setModalState] = useState(false);
    const [assistantGenre, setAssistantGenre] = useState('');
    const [menuState, setMenuState] = useState(false);
    const [stateModalQuiz, setStateModalQuiz] = useState(false);
    const [answ, setAnsw] = useState(null);
    const [next, setNext] = useState(false);
    const [menu, setMenu] = useState(false);
    const [scale, setScale] = useState(Array(30).fill({ status: false, id: null }));
    const [modalRes, setModalRes] = useState(false);

    useSpatnavInitialization();

    const initialize = (getState) => {
        if (process.env.NODE_ENV === 'development') {
            return createSmartappDebugger({
                token: process.env.REACT_APP_TOKEN ?? '',
                initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
                getState,
            });
        } else {
            return createAssistant({ getState });
        }
    };

    const assistantStateRef = useRef();
    const assistantRef = useRef();

    useEffect(() => {
        assistantRef.current = initialize(() => assistantStateRef.current);
        
        // Обработчик всех событий от ассистента
        assistantRef.current.on('data', (event) => {
            console.log('Assistant event:', event);
            handleAssistantDataEvent(event);
        });

        // Обработчик команд
        assistantRef.current.on('command', (command) => {
            console.log('Assistant command:', command);
            handleAssistantCommand(command);
        });
    }, []);

    const handleAssistantCommand = (command) => {
        console.log('Handling command:', command);
        if (command) {
            dispatchAssistantAction({ type: command.type, id: command.payload });
        }
    };

    const handleAssistantDataEvent = (event) => {
        console.log('Handling assistant data:', event);
        
        switch (event?.type) {
            case 'smart_app_data':
                handleSmartAppData(event);
                break;
            case 'character':
                setCharacter(event.character?.id);
                break;
            default:
                console.log('Unknown event type:', event?.type);
        }
    };

    const handleSmartAppData = (event) => {
        console.log('Handling smart app data:', event);
        if (event.action) {
            dispatchAssistantAction(event.action);
        } else if (event.action_id) {
            // Обработка прямых действий
            dispatchAssistantAction({
                type: event.action_id,
                id: event.parameters?.number
            });
        }
    };


    function dispatchAssistantAction(action) {
        console.log('dispatchAssistantAction', action);
        if (action) {
            switch (action.type) {
                case 'learn_facts':
                case 'learnFacts':
                    return learn_Facts(action);
                case 'closeModalForLearn':
                case 'close_modal_window':
                    setModalState(false);
                    setStateModalQuiz(false);
                    break;
                case 'chooseTheme':
                case 'choose_theme':
                    handleThemeSelection(action.id);
                    break;
                case 'returnMenu':
                case 'return_menu':
                    setMenuState(true);
                    break;
                case 'attemptToQuiz':
                    setStateModalQuiz(true);
                    break;
                case 'checkAnsw':
                case 'Answer':
                    handleAnswer(action.id);
                    break;
                case 'nextQuest':
                case 'Next':
                    setNext(true);
                    break;
                case 'returnMenuAfterGame':
                case 'MenuAfterGame':
                    setMenu(true);
                    break;
                case 'ScaleFact':
                    handleScaleFact(action.id);
                    break;
                case 'CloseModalFact':
                    handleCloseModalFact();
                    break;
                case 'show_res':
                case 'showRes':
                    setModalRes(true);
                    break;
                default:
                    console.log('Unknown action type:', action.type);
            }
        }
    }

    function handleThemeSelection(themeId) {
        console.log('Handling theme selection:', themeId);
        let selectedTheme = '';
        if (themeId === '1' || themeId === 'Страны' || themeId === 'страны') {
            selectedTheme = 'country';
        } else if (themeId === '2' || themeId === 'Животные' || themeId === 'животные') {
            selectedTheme = 'animals';
        } else if (themeId === '3' || themeId === 'Машины' || themeId === 'машины') {
            selectedTheme = 'cars';
        }
        
        const resetScale = scale.map((o, index) => ({ ...o, status: false, id: index }));
        setScale(resetScale);
        setAssistantGenre(selectedTheme);
    }

    function handleAnswer(id) {
        const answerId = parseInt(id, 10);
        setAnsw(answerId);
    }

    function handleScaleFact(id) {
        const factId = parseInt(id, 10);
        const updatedScale = scale.map((o, index) => ({
            ...o,
            status: index === factId - 1,
            id: index
        }));
        setScale(updatedScale);
    }

    function handleCloseModalFact() {
        const resetScale = scale.map((o, index) => ({
            ...o,
            status: false,
            id: index
        }));
        setScale(resetScale);
    }

    function assistant_global(n, state) {
        console.log('Assistant global called:', { n, state });
        // Сразу обрабатываем действие локально
        dispatchAssistantAction({
            type: state,
            id: n
        });
        // Отправляем данные ассистенту
        assistantRef.current.sendData({
            action: {
                action_id: state,
                parameters: {
                    number: n,
                },
            },
        });
    }

    function learn_Facts(_action) {
        console.log('learn_Facts called, setting modalState to true');
        setModalState(true);
    }


    return (
        <GenreContext.Provider value={{
            genre,
            setGenre,
        }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/game" element={<Game res={modalRes} setModalRes={setModalRes}
                                                   assistant_global={assistant_global}
                                                   menu={menu} setMenu={setMenu} next={next}
                                                   setNext={setNext} setAnsw={setAnsw}
                                                   answ={answ}/>}/>
                    <Route path="/facts"
                           element={<DifferentQuotes assistant_global={assistant_global}
                                                 scale={scale} setScale={setScale}
                                                 setReturnMenuState={setMenuState}
                                                 returnMenuState={menuState}/>}/>
                    <Route path="/" element={<Menu assistant_global={assistant_global}
                                               modalQuiz={stateModalQuiz}
                                               setModalQuiz={setStateModalQuiz}
                                               state={modalState} setState={setModalState}
                                               setAssistantGenre={setAssistantGenre}
                                               AssistantGenre={assistantGenre}/>}/>
                </Routes>
            </BrowserRouter>
        </GenreContext.Provider>
    );
}

export default App;
