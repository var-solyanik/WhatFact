import { useEffect } from 'react';

export const useModalBackClose = (isOpen, onClose) => {
	useEffect(() => {
		if (isOpen) {
			window.history.pushState({ modalOpen: true }, '');
		}
		
		const handlePopState = (_e) => {
			if (isOpen) {
				onClose(); // закрыть модалку
			}
		};
		
		window.addEventListener('popstate', handlePopState);
		
		return () => {
			window.removeEventListener('popstate', handlePopState);
			if (isOpen) {
				window.history.back(); // очистить историю, если закрыли вручную
			}
		};
	}, [isOpen, onClose]);
};