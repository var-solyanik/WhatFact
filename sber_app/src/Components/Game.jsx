import React, { useContext, useEffect, useState } from 'react';
import '../function/createArray';
import { ArrayQuestionsFacts } from '../function/createArray';
import '../style/Game.css';
import ButtonNextQuest from './ButtonNextQuest';
import ButtonMenu from './ButtonMenu';
import { useNavigate } from 'react-router-dom';
import { GenreContext } from '../hook/context';
import { spatnavInstance, useSection, getCurrentFocusedElement } from '@salutejs/spatial'; // Добавил getCurrentFocusedElement

const Game = ({res, setModalRes, assistant_global, menu, setMenu, answ, setAnsw, next, setNext, dispatchAssistantAction}) => { // <<< ДОБАВЬТЕ dispatchAssistantAction ЗДЕСЬ
    // rgb(255,36,0)- неверный ответ  rgb(0, 238, 4) - верный ответ
    const [currentQuestions, setCurrentQuestions] = useState(0);
    const [arrayQuestions, setArrayQuestions] = useState([]);
    const [btnState, setBtnState] = useState(false);
    const [btn, setBtnColor] = useState(Array(4).fill({background: "white", color: "black"}));
    const [offGameButton, setOffGameButton] = useState(false);
    const [BtnMenuState, setBtnMenuState] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const router = useNavigate(); // <-- Это 'router' не используется, можете удалить
    const {genre} = useContext(GenreContext);

    const navigate = useNavigate(); // Добавляем useNavigate

    // Секции для навигации
    const [gameSection, customizeGameSection] = useSection('GameSection', {
        enterTo: 'default-element',
        defaultElement: 'returnBtnGame' // Главная секция при входе в игру
    });

    const [gameButtonSection, customizeGameButton] = useSection('gameButtonSection', {
        enterTo: 'default-element',
        defaultElement: 'btn_answ1' // Секция кнопок ответов
    });

    const [returnMenuSection, customizeReturnMenu] = useSection('MenuAfterGame', {
        enterTo: 'default-element',
        defaultElement: 'returnBtnGame'
    });

    function isLengthZero(){
        return arrayQuestions.length === 0;
    }

    function isLastQuestions(){
        return currentQuestions === 9;
    }

    const checkAnsw = (number) => {
        setBtnState(true);
        setBtnMenuState(true);
        const afterClick = btn.map((o, index) => {
            if(index === number && (number + 1) === arrayQuestions[currentQuestions].validAnswers){
                setCorrectAnswers(correctAnswers + 1);
                if(isLastQuestions()){
                    assistant_global(null, "suggestRes");
                } else {
                    assistant_global(null, "correctAnsw");
                }
                return {...o, background: "rgb(38, 129, 39)", color: "white"};
            } else if(index === number && (number + 1) !== arrayQuestions[currentQuestions].validAnswers){
                if(isLastQuestions()){
                    assistant_global(null, "suggestRes");
                } else {
                    assistant_global(null, "uncorrectAnsw");
                }
                return {...o, background: "rgb(155, 41, 24)", color: "white"};
            } else if(index === arrayQuestions[currentQuestions].validAnswers - 1){
                return {...o, background: "rgb(38, 129, 39)", color: "white"};
            } else {
                return{...o, background: "white", color: "black"};
            }
        });
        setBtnColor(afterClick);
        setOffGameButton(true);
    };

    useEffect(() => {
        if(currentQuestions !== 9){
            if(answ !== null && btnState === false ){
                customizeGameButton({
                    disabled: true,
                });
                checkAnsw(answ - 1);
                setAnsw(null);
            }
        } else {
            if(answ !== null && BtnMenuState === false ){
                customizeGameButton({
                    disabled: true,
                });
                checkAnsw(answ - 1);
                setAnsw(null);
            }
        }
    }, [answ, btnState, BtnMenuState, currentQuestions, customizeGameButton, checkAnsw, setAnsw]); // Добавлены зависимости для useEffect

    useEffect(() => {
        if(menu){
            // window.history.go(-1); // <-- Эту строку удаляем, навигация уже происходит в App.js
            setMenu(false);
            setBtnMenuState(false);
        }
    }, [menu, setMenu, setBtnMenuState]); // Добавлены зависимости для useEffect

    useEffect(() => {
        if(next && btnState){
            setCurrentQuestions(currentQuestions + 1);
            setBtnState(false);
            const afterClick = btn.map((o) => {
                return {...o, background: "white", color: "black"};
            });
            setBtnColor(afterClick);
            setOffGameButton(false);
            setBtnMenuState(false);
            customizeGameButton({
                disabled: false,
            });
            // spatnavInstance.focus('GameButton'); // <-- Не нужно здесь, фокус будет установлен ниже
        }
        setNext(false);
    }, [next, btnState, btn, currentQuestions, setBtnColor, setOffGameButton, setBtnMenuState, customizeGameButton, setNext]); // Добавлены зависимости для useEffect


    useEffect(() =>{
        setArrayQuestions(ArrayQuestionsFacts(genre));
        spatnavInstance.focus('returnBtnGame');
        setModalRes(false);
    }, [genre, setModalRes]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const focusedElement = getCurrentFocusedElement();
            if (!focusedElement) return; // Если нет сфокусированного элемента, выходим

            switch (event.code) {
                case 'ArrowDown':
                    if (focusedElement.id === 'returnBtnGame') {
                        event.preventDefault(); // Предотвращаем стандартное поведение
                        spatnavInstance.focus('btn_answ1'); // Фокусируемся на первой кнопке ответа
                    }
                    break;
                case 'ArrowUp':
                    if (focusedElement.closest('.game_button') || focusedElement.id.startsWith('btn_answ')) {
                        event.preventDefault();
                        spatnavInstance.focus('returnBtnGame');
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []); // Пустой массив зависимостей, чтобы обработчик вешался один раз

    return (
        <div {...gameSection} className='game_menu'>
            <div {...returnMenuSection}>
            <button onClick={() => assistant_global(null, "returnMenu")} className='sn-section-item menu'>Главное меню</button>
            </div>

            <h1 className="question-text">
                Факт {currentQuestions + 1}/10:
                <pre></pre>
                {isLengthZero()
                    ? <div>Привет</div>
                    : arrayQuestions[currentQuestions].Fact
                }
            </h1>

            <div {...gameButtonSection} className='sn-section-root game_button'
                 style={offGameButton ? {pointerEvents: 'none'} : {}}>
                <button className='sn-section-item btn_answ'
                        style={{background: btn[0].background, color: btn[0].color}} id='btn_answ1'
                        onClick={() => assistant_global("1", "checkAnsw")}>
                    {isLengthZero()
                        ? <div></div>
                        : arrayQuestions[currentQuestions].Answer[0]
                    }
                </button>
                <button className='sn-section-item btn_answ'
                        style={{background: btn[1].background, color: btn[1].color}} id='btn_answ2'
                        onClick={() => assistant_global("2", "checkAnsw")}>
                    {isLengthZero()
                        ? <div></div>
                        : arrayQuestions[currentQuestions].Answer[1]
                    }
                </button>
                <button className='sn-section-item btn_answ'
                        style={{background: btn[2].background, color: btn[2].color}} id='btn_answ3'
                        onClick={() => assistant_global("3", "checkAnsw")}>
                    {isLengthZero()
                        ? <div></div>
                        : arrayQuestions[currentQuestions].Answer[2]
                    }
                </button>
                <button className='sn-section-item btn_answ'
                        style={{background: btn[3].background, color: btn[3].color}} id='btn_answ4'
                        onClick={() => assistant_global("4", "checkAnsw")}>
                    {isLengthZero()
                        ? <div></div>
                        : arrayQuestions[currentQuestions].Answer[3]
                    }
                </button>
            </div>

            {isLastQuestions()
                ? <ButtonMenu res={res} setModalRes={setModalRes} correctAnswers={correctAnswers}
                              state_btnMenu={BtnMenuState} handleClick={assistant_global}/>
                : <ButtonNextQuest state_btn={btnState} handleClick={assistant_global}/>
            }
        </div>
    );
};

export default Game;