import { useState } from 'react';

const useCurrentView = () => {
    const [currentView, setCurrentView] = useState<'menu' | 'content'>('content');

    return { currentView, setCurrentView };
};

export default useCurrentView;
