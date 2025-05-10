import React, { useEffect, useState } from 'react';
import '../style/Menu.css';
import '../style/Fact.css';
import lupa from '../jpg/lupa.png';
import ModalWindow from './ModalWindow';
import closeButtonImage from '../jpg/closeButton2.png'
import { spatnavInstance, useSection } from '@salutejs/spatial';

const Fact = ({reference, assistant_global, scaleStatus, setScale, number, fact, answer}) => {

    //const [AllSection, customize] = useSection('AllSection');
    const [lupaFocus, customizeLupa] = useSection(`lupaSection${number}`);
    const [CloseScaleFacts, customizeCLoseScaleFact] = useSection(`ScaleFact${number}`);
    
    const scaleFact = () => {
        assistant_global(number, "ScaleFact");
    }

    useEffect(() => {
        setModalActive(scaleStatus);
        if(scaleStatus){
            customizeCLoseScaleFact({
                disabled:false,
            })
            spatnavInstance.focus(`ScaleFact${number}`);
            assistant_global(fact, "SayFact");
        }
        else{
            customizeCLoseScaleFact({
                disabled:true,
            })
            spatnavInstance.focus(`lupaSection${number}`);
        }
    }, [scaleStatus])

    const [modalActive, setModalActive] = useState(false);
  return (
    <div className='div_facts'>
        <blockfact className='fact'>
            <p className='facts'>{number}. {fact}</p>
            <cite className='answer'>{answer}</cite>
        </blockfact>
        <div {...lupaFocus}><button ref={reference} id={number} className='sn-section-item lupa' tabIndex={-1} onClick={() => scaleFact()}>
            <img className='lupa_image' src={lupa}/>
        </button></div>
        <ModalWindow assistant_global={assistant_global} active={modalActive} setActive={setModalActive} setModalState={{setScale, scaleStatus}} >
            <div {...CloseScaleFacts} style={{display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'}}>
                <blockfact className='factInScale'>
                    <p className='factsInScale'>{number}. {fact}</p>
                    <cite className='answerInScale'>{answer}</cite>
                </blockfact>
                <button id={number} className="sn-section-item closeButton" tabIndex={-1} onClick={() => assistant_global(null, "closeFactModal")}>
                    <img className="closeButtonImage" src={closeButtonImage}/>
                </button>
            </div> 
        </ModalWindow>
    </div>
  )
}

export default Fact;