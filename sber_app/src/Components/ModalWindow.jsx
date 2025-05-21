import React from 'react';
import '../style/Menu.css';
import { useSection } from '@salutejs/spatial';

const ModalWindow = (
	{
		assistant_global,
		active,
		setModalState,
		setActive,
		children,
	}) => {
	const [modalSection, customizeModal] = useSection('modalSection', {
		enterTo: 'default-element',
		defaultElement: 'modalContent',
	});
	
	const setState = () => {
		if (Object.keys(setModalState).length === 2) {
			console.log('2');
			//setModalState.setScale(array);
			assistant_global(null, 'closeFactModal');
		} else {
			console.log('1');
			//setModalState(false);
			assistant_global(null, 'closeModalForLearn');
		}
	};
	
	return (
		<div
			{...modalSection}
			className={active ? 'ModalWin active' : 'ModalWin'}
			onClick={() => {
				setActive(false);
				setState();
			}}
		>
			<div
				id="modalContent"
				className={active ? 'ModalCont active' : 'ModalCont'}
				onClick={e => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};

export default ModalWindow;