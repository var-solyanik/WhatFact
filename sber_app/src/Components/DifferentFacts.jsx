import React, { useContext, useEffect, useRef, useState } from 'react';
import '../style/DifferentFacts.css';
import full_data from '../data/full_facts';
import Fact from './Fact';
import { GenreContext } from '../hook/context';
import { useNavigate } from 'react-router-dom';
import { getCurrentFocusedElement, spatnavInstance, useSection } from '@salutejs/spatial';

const DifferentFacts = ({assistant_global, scale, setScale, returnMenuState, setReturnMenuState}) => { 
  const {genre} = useContext(GenreContext);
  const dataGenreFacts = full_data[genre];
  const router = useNavigate();

  const themeNames = {
    'country': 'Страны',
    'animals': 'Животные',
    'cars': 'Машины'
  };

  const [menuFocus, customizeMenu] = useSection('PageFacts', {
    enterTo: 'default-element',
    defaultElement: 'returnMenu'
  });
  const [returnMenu, customizeReturnMenu] = useSection("returnMenu", {
    enterTo: 'default-element',
    defaultElement: '0'
  });
  const [allFact, customizeAllFact] = useSection('AllFact', {
    enterTo: 'default-element',
    defaultElement: '1'
  });
  const ref = useRef(null);

  useEffect(() => {
    spatnavInstance.focus('returnMenu');
  }, []);
  
  useEffect(() => {
    const result = scale.filter((temp) => temp.status !== false);
    if(result.length !== 0){
      customizeAllFact({
        disabled: true,
      });
      customizeReturnMenu({
        disabled: true,
      });
    } else {
      customizeAllFact({
        disabled: false,
      });
      customizeReturnMenu({
        disabled: false,
      });
    }
  }, [scale]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const focusedReturnMenu = getCurrentFocusedElement();
      switch (event.code) {
        case 'ArrowDown':
          if(focusedReturnMenu.id !== '1'){
            event.preventDefault();
            ref.current = focusedReturnMenu;
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center'});       
            break;
          }
        case 'ArrowUp':
          event.preventDefault();
          ref.current = focusedReturnMenu;
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if(returnMenuState){
      setReturnMenuState(false);
    }
  }, [returnMenuState]);

  return (
    <div {...menuFocus} className='sn-section-root page_facts'>
      <div {...returnMenu}>
        <button id='0' onClick={() => assistant_global(null, "returnMenu")} className='sn-section-item menu'>Главное меню</button>
      </div>
      <div className="different_facts">
        <h1 className='name_facts'>
          {themeNames[genre]}
        </h1>
        <div {...allFact} className='all_facts'>
          {dataGenreFacts.map((option, index) =>
            <Fact 
              reference={ref} 
              assistant_global={assistant_global} 
              scaleStatus={scale[index].status} 
              setScale={setScale} 
              key={option.id + 1} 
              number={option.id + 1} 
              fact={option.fact}
            />
          )}
        </div>
      </div>
      <div style={{height:'170px'}}></div>
      <div className='panel'></div>
    </div>    
  );
};

export default DifferentFacts;