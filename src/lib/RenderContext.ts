import { createContext } from 'react';

export const RenderingContext = createContext<
    ['menu' | 'content', React.Dispatch<React.SetStateAction<'menu' | 'content'>>] | null
>(null);
