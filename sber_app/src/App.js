import React, { useRef, useState, useEffect } from "react";
import './style/style.css';
import {  Routes, Route, useNavigate } from "react-router-dom";
import { GenreContext } from "./hook/context";
import { createAssistant, createSmartappDebugger } from "@salutejs/client";
import Game from "./Components/Game";
import DifferentQuotes from "./Components/DifferentFacts";
import Menu from "./Components/Menu";
import { useSpatnavInitialization } from "@salutejs/spatial";

function App() {
  const [character, setCharacter] = useState('sber');
  const [genre, setGenre] = useState("country");
  const [modalState, setModalState] = useState(false);
  const [assistantGenre, setAssistantGenre] = useState("");
  const [menuState, setMenuState] = useState(false);
  const [stateModalQuiz, setStateModalQuiz] = useState(false);
  const [answ, setAnsw] = useState(null);
  const [next, setNext] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scale, setScale] = useState(Array(30).fill({status: false, id: null}));
  const [modalRes, setModalRes] = useState(false);

  const navigate = useNavigate();

  useSpatnavInitialization();

  const initialize = (getState) => {
    if(process.env.NODE_ENV === 'development'){
      return createSmartappDebugger({
        token: process.env.REACT_APP_TOKEN ?? "",
        initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
        getState,
      });
    }
    else{
      return createAssistant({getState});
    }
  }


  const assistantStateRef = useRef();
  const assistantRef = useRef();

  console.log('App component is rendering/re-rendering.'); // Этот лог будет срабатывать при каждом рендере

  useEffect(() => {
    console.log('App useEffect: Initializing assistant.'); // Этот лог будет срабатывать только при монтировании
    assistantRef.current = initialize(() => assistantStateRef.current);
    assistantRef.current.on("data", (action) => {
      handleAssistantDataEvent(action)
    });
    assistantRef.current.on("command", (event) => {
      dispatchAssistantAction(event?.command);
    })
    console.log('App useEffect cleanup: Assistant is being unmounted.'); // Этот лог будет срабатывать при размонтировании
  }, [])

  const handleAssistantDataEventSmartAppData = (event) => {
    console.log('AssistantWrapper.handleAssistantEventSmartAppData: event:', event);

    if (event.sub !== undefined) {
      // this.emit('event-sub', event.sub);
      // /*await*/ this._App.handleAssistantSub(event.sub);
    }

    const action = event.action;
    dispatchAssistantAction(action);
  }

  const handleAssistantDataEvent = (event) => {
    console.log('handleAssistantDataEvent');
    switch (event?.type) {
      case "character":
        // notify(event.type);
        setCharacter(event.character?.id)
        break;
      case "sdk_answer":
        // notify(event.type);
        handleAssistantDataEventSmartAppData(event);
        break;

      case "smart_app_data":
        // notify(event.type);
        handleAssistantDataEventSmartAppData(event);
        break

      default:
        break
    }
  }

  function dispatchAssistantAction(action){
    console.log('dispatchAssistantAction', action);
    if (action) {
      switch (action.type) {
        case 'learn_facts':
          return  learn_Facts(action);
        case 'close_modal_window':
          return closeModalWindow(action);
        case 'choose_theme':
          return chooseTheme(action);
        case 'return_menu':
          console.log("dispatchAssistantAction: Сработал case return_menu");
          return showCategorySelection(action);
        case 'attemptToQuiz':
          return attemptToQuiz();
        case 'Answer':
          return checkAnsw(action);
        case 'Next':
          return NextQuest(action);
        case 'MenuAfterGame':
          console.log("dispatchAssistantAction: Сработал case menuaftergame");
          return MenuAfterGame(action);
        case 'ScaleFact':
          return ScaleFact(action);
        case 'CloseModalFact':
          return closeModalFact();
        case 'showRes':
          return showRes();
        default:
          throw new Error();
      }
    }
  }

  function showRes(){
    setModalRes(true);
  }

  function closeModalFact(){
    const afterPhrase = scale.map((o, index) => {
      return {...o, status: false, id: index}
    })
    setScale(afterPhrase);
  }

  function ScaleFact(action){
    const id = parseInt(action.id, 10);
    const afterPhrase = scale.map((o, index) => {
      if(id - 1 === index){
        return {...o, status: true, id: index}
      }
      else{
        return {...o, status: false, id: index}
      }
    })
    setScale(afterPhrase);
  }

  function MenuAfterGame(action){
    setModalState(false);      // Закрыть модалку фактов
    setStateModalQuiz(false);  // Закрыть модалку квиза
    setModalRes(false);        // Закрыть модалку результатов квиза
    setStateModalQuiz(true);   // Открыть модалку выбора категорий квиза
    navigate('/');   
  }

  function NextQuest(action){
    setNext(true);
  }

  function checkAnsw(action){
    switch(action.id){
      case "1":
        setAnsw(1);
        break;
      case "2":
        setAnsw(2);
        break;
      case "3":
        setAnsw(3);
        break;
      case "4":
        setAnsw(4);
        break;
      default:
        return console.log("hello");
    }
  }

  function attemptToQuiz(){
    setStateModalQuiz(true);
  }

  function showCategorySelection(action) {
    console.log('Вызвана showCategorySelection')
    setModalState(false);
    setStateModalQuiz(false);
    setModalRes(false);
    setModalState(true); // Открываем модальное окно выбора тем для квиза
    navigate('/'); // Возвращаем на главную страницу           // Возвращаемся на корневой путь
  }

  function showGameCategorySelection() {
    console.log('Вызвана showGameCategorySelection. setStateModalQuiz(true) будет вызван.'); // ДОБАВЬТЕ ЭТО
    setModalState(false);      // Закрыть модалку фактов
    setStateModalQuiz(false);  // Закрыть модалку квиза (если она была открыта)
    setModalRes(false);        // Закрыть модалку результатов квиза (если она была открыта)
    setStateModalQuiz(true);   // <<<--- Вот это открывает модалку КВИЗА/ТЕСТА
    navigate('/');             // Вернуться на главный маршрут
  }

  function chooseTheme(action){
    if(action.id === '1' || action.id === 'Страны' || action.id === 'страны'){
      const res = scale.map((o, index) => {
          return {...o, status: false, id: index};
      });
      setScale(res);
      setAssistantGenre("country");
    }
    else if(action.id === '2' || action.id === 'Животные' || action.id === 'животные'){
      const res = scale.map((o, index) => {
          return {...o, status: false, id: index};
      });
      setScale(res);
      setAssistantGenre("animals");
    }
    else if(action.id === '3' || action.id === 'Машины' || action.id === 'машины'){
      const res = scale.map((o, index) => {
          return {...o, status: false, id: index};
      });
      setScale(res);
      setAssistantGenre("cars");
    }
  }

  function learn_Facts(action) {
    setModalState(true);
  }

  function closeModalWindow(action){
    setModalState(false);
    setStateModalQuiz(false);    
  }

  function assistant_global(n, state) {
    console.log('Calling assistant_global with:', n, state);
    console.log('assistantRef.current BEFORE sendData:', assistantRef.current); // <--- Make sure this shows the assistant object, not null/undefined

    if (assistantRef.current) {
      try {
        assistantRef.current.sendData({
          action: {
            action_id: state,
            parameters: {
              number: n
            }
          }
        });
        console.log('assistantRef.current.sendData() was invoked.'); // <--- Add this log
      } catch (e) {
        console.error('ERROR: Calling sendData() failed:', e); // <--- Add this error log
      }
    } else {
      console.error('ERROR: assistantRef.current is null/undefined! Cannot send data.');
    }
  }

  return (
      <GenreContext.Provider value={{
        genre,
        setGenre
      }}>
        <Routes>
          {/* Передаем dispatchAssistantAction в Game */}
          <Route path="/game" element={<Game
              res={modalRes}
              setModalRes={setModalRes}
              assistant_global={assistant_global} // Можно оставить, если другие кнопки его используют
              dispatchAssistantAction={dispatchAssistantAction} // <<< ДОБАВЛЯЕМ ЭТОТ ПРОПС
              menu={menu} setMenu={setMenu} next={next} setNext={setNext} setAnsw={setAnsw} answ={answ}/>}/>
          {/* Передаем dispatchAssistantAction в DifferentQuotes */}
          <Route path="/facts" element={<DifferentQuotes
              assistant_global={assistant_global} // Можно оставить
              dispatchAssistantAction={dispatchAssistantAction} // <<< ДОБАВЛЯЕМ ЭТОТ ПРОПС
              scale={scale} setScale={setScale} setReturnMenuState={setMenuState} returnMenuState={menuState}/>}/>
          <Route path="/" element={<Menu assistant_global={assistant_global} modalQuiz={stateModalQuiz} setModalQuiz={setStateModalQuiz} state={modalState} setState={setModalState} setAssistantGenre={setAssistantGenre} AssistantGenre={assistantGenre}/>}/>
        </Routes>
      </GenreContext.Provider>
  );
}

export default App;