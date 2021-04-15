import {createContext} from 'react';

function noop() {}

export const SettingContext = createContext({
    isSound: null,
    showTranslate: null,
    showButton: null,
    wordsCount: null,
    life: null,
    changeSetting: noop
})
