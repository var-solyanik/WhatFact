import React, { useEffect, useState } from 'react';
import '../style/Menu.css';
import '../style/Fact.css';
import { useModalBackClose } from '../hook/useModalBackClose.js';
import lupa from '../jpg/lupa.png';
import ModalWindow from './ModalWindow';
import closeButtonImage from '../jpg/closeButton2.png';
import { spatnavInstance, useSection } from '@salutejs/spatial';

const Fact = (
	{
		reference,
		assistant_global,
		scaleStatus,
		setScale,
		number,
		fact,
		answer,
	}) => {
	
	const [lupaFocus, customizeLupa] = useSection(`lupaSection${number}`, {
		enterTo: 'default-element',
		defaultElement: number.toString(),
	});
	const [CloseScaleFacts, customizeCLoseScaleFact] = useSection(`ScaleFact${number}`, {
		enterTo: 'default-element',
		defaultElement: number.toString(),
	});
	
	const scaleFact = () => {
		assistant_global(number, 'ScaleFact');
	};
	
	const closeModal = () => {
		setModalActive(false);
		setScale(prev => prev.map(
			(item, idx) => idx === number - 1 ? { ...item, status: false } : item));
		assistant_global(null, 'CloseModalFact');
	};
	
	useEffect(() => {
		setModalActive(scaleStatus);
		if (scaleStatus) {
			customizeCLoseScaleFact({
				disabled: false,
			});
			spatnavInstance.focus(`ScaleFact${number}`);
			assistant_global(fact, 'SayFact');
		} else {
			customizeCLoseScaleFact({
				disabled: true,
			});
			spatnavInstance.focus(`lupaSection${number}`);
		}
	}, [scaleStatus]);
	
	const [modalActive, setModalActive] = useState(false);
	
	useModalBackClose(modalActive, closeModal);
	
	return (
		<div className="div_facts">
			<div className="fact">
				<p className="facts">{number}. {fact}</p>
				<cite className="answer">{answer}</cite>
			</div>
			<div {...lupaFocus}>
				<button ref={reference} id={number} className="sn-section-item lupa"
				        onClick={() => scaleFact()}>
					<img className="lupa_image" src={lupa} alt="Magnifying glass"/>
				</button>
			</div>
			<ModalWindow assistant_global={assistant_global} active={modalActive}
			             setActive={setModalActive} setModalState={{ setScale, scaleStatus }}>
				<div {...CloseScaleFacts} style={{
					display: 'flex',
					height: '100%',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
					<div className="factInScale">
						<p className="factsInScale">{number}. {fact}</p>
						<cite className="answerInScale">{answer}</cite>
					</div>
					<button
						className="sn-section-item closeButton"
						onClick={closeModal}
					>
						<img className="closeButtonImage" src={closeButtonImage} alt="Close"/>
					</button>
				</div>
			</ModalWindow>
		</div>
	);
};

export default Fact;