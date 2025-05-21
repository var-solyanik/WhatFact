import React, { useContext, useEffect, useState, useRef } from "react";
import '../style/Menu.css'
import ModalWindow from "./ModalWindow";
import { useNavigate } from "react-router-dom";
import { GenreContext } from "../hook/context";
import closeButtonImage from "../jpg/closeButton2.png";
import { getCurrentFocusedElement, spatnavInstance, useSection } from "@salutejs/spatial";

const Menu = ({assistant_global, state, setState, AssistantGenre, setAssistantGenre, modalQuiz, setModalQuiz}) => {
    const router = useNavigate();
    const [modalActive1, setModalActive1] = useState(false);
    const [modalActive2, setModalActive2] = useState(false);
    const {genre, setGenre} = useContext(GenreContext);

    const [sectionProps, customize1] = useSection('allInteface', {
        enterTo: 'default-element',
        defaultElement: 'btnMenu'
    });
    const [sectionProps2, customize2] = useSection('btnForFact', {
        enterTo: 'default-element',
        defaultElement: 'btnInModal1'
    });
    const [sectionProps3, customize3] = useSection('btnMenu', {
        enterTo: 'default-element',
        defaultElement: '1'
    });
    const [sectionProps4, customize4] = useSection('btnForQuiz', {
        enterTo: 'default-element',
        defaultElement: 'btnInModal1'
    });

    useEffect(() => {
      const intervalId = setInterval(() => {
        const focusedElement = getCurrentFocusedElement();
        console.log("Focused element:", focusedElement);
      }, 5000); // 5000 миллисекунд = 5 секунд

      // Очистка интервала при размонтировании компонента
      return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
      setModalActive1(state);
      if(state){
        customize3({ //btnMenu
          disabled: true,
        });
        customize2({ //btnForFact
          disabled: false,
        });
        customize4({ //btnForQuiz
          disabled: true,
        });
        spatnavInstance.focus('btnForFact');
      } else {
        customize2({ //btnForFact
          disabled: true, 
        });
        customize4({ //btnForQuiz
          disabled: true,
        });
        customize3({ //btnMenu
          disabled: false,
        });
        spatnavInstance.focus('btnMenu');
      }
    }, [state]);

    useEffect(() => {
      setModalActive2(modalQuiz);
      if(modalQuiz){
        customize3({ //btnMenu
          disabled: true,
        });
        customize2({ //btnForFact
          disabled: true,
        });
        customize4({ //btnForQuiz
          disabled: false,
        });
        spatnavInstance.focus('btnForQuiz');
      } else {
        customize2({ //btnForFact
          disabled: true,
        });
        customize4({ //btnForQuiz
          disabled: true,
        });
        customize3({ //btnMenu
          disabled: false,
        });
        spatnavInstance.focus('btnMenu');
      }
    }, [modalQuiz]);

    useEffect(() =>{
      setGenre(AssistantGenre);
      if(AssistantGenre !== ""){
        if(modalQuiz){
          router('/game');
          setAssistantGenre("");
          setModalQuiz(false);
          assistant_global(null, "suggestQuiz");
        }
        if(state){
          router('/facts')
          setAssistantGenre("");
          setState(false);
          assistant_global(null, "suggestFact");
        }
      }
    }, [AssistantGenre]);

    return(
      <div {...sectionProps} className="sn-section-root Menu">
        <p className="home_text">WHAT FACT</p>
        <div {...sectionProps3} className="btn_main">
          <button className="sn-section-item btn" id="1" onClick={() => assistant_global(null, "learnFacts")}>Узнать факты</button>
          <button className="sn-section-item btn" id="2" onClick={() => assistant_global(null, "attemptToQuiz")}>Пройти тест</button>
        </div>
        <ModalWindow assistant_global={assistant_global} active={modalActive1} setActive={setModalActive1} setModalState={setState}>
          <div {...sectionProps2} style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
            <h2 style={{fontSize: '2.5vw', fontFamily: 'Montserrat'}}>Выберите тему фактов:</h2>
            <button className="sn-section-item btnInModal" id="btnInModal1" onClick={() => assistant_global("Страны", "chooseTheme")}>Страны</button>
            <button className="sn-section-item btnInModal" id="btnInModal2" onClick={() => assistant_global("Животные", "chooseTheme")}>Животные</button>
            <button className="sn-section-item btnInModal" id="btnInModal3" onClick={() => assistant_global("Машины", "chooseTheme")}>Машины</button>
            <button className="sn-section-item closeButton" onClick={() => assistant_global(null, "closeModalForLearn")}>
              <img className="sn-section-item closeButtonIImage" src={closeButtonImage} alt="Close"/>
            </button>
          </div>
        </ModalWindow>
        <ModalWindow assistant_global={assistant_global} active={modalActive2} setActive={setModalActive2} setModalState={setModalQuiz}>
          <div {...sectionProps4} style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
            <h2 style={{fontSize: '2.5vw', fontFamily: 'Montserrat'}}>Выберите тему фактов:</h2>
            <button className="sn-section-item btnInModal" id="btnInModal1" onClick={() => assistant_global("Страны", "chooseTheme")}>Страны</button>
            <button className="sn-section-item btnInModal" id="btnInModal2" onClick={() => assistant_global("Животные", "chooseTheme")}>Животные</button>
            <button className="sn-section-item btnInModal" id="btnInModal3" onClick={() => assistant_global("Машины", "chooseTheme")}>Машины</button>
            <button className="sn-section-item closeButton" onClick={() => assistant_global(null, "closeModalForLearn")}>
              <img className="sn-section-item closeButtonIImage" src={closeButtonImage} alt="Close"/>
            </button>
          </div>  
        </ModalWindow>
      </div>
    )
}

export default Menu;