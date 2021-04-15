import {useCallback, useEffect, useState, useContext} from 'react';
import { AuthContext } from '../context/AuthContext';

const storageName = 'userDataRSLangTeam44Setting';

export const useSetting = () => {
    const [isSound, setIsSound] = useState(true);
    const [showTranslate, setShowTranslate] = useState(true);
    const [showButton, setShowButton] = useState(true);
    const [wordsCount, setWordsCount] = useState(20);
    const [life, setLife] = useState(5);

    const auth = useContext(AuthContext);

    const putSetting = async (sound, transl, btn, words, lf, id, token) => {
        try {
            await fetch(`/users/${id}/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    setting : {
                        isSound: sound,
                        showTranslate: transl,
                        showButton: btn,
                        wordsCount: words,
                        life: lf
                    }
                })
            })
        } catch (e) {

        }
    }

    const changeSetting = useCallback((sound, transl, btn, words, lf, id = null, token = null) => {
        setIsSound(sound);
        setShowTranslate(transl);
        setShowButton(btn);
        setWordsCount(words);
        setLife(lf);

        if (id === null) {
            localStorage.setItem(storageName, JSON.stringify({isSound: sound, showTranslate: transl, showButton: btn, wordsCount: words, life: lf}))
        } else {            
            putSetting(sound, transl, btn, words, lf, id, token)
        }
    }, []);

    const getSetting = useCallback(
        async (id, token) => {
            try {
                const response = await fetch(`/users/${id}/settings`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                const settings = await response.json();
                const { isSound, showTranslate, showButton, wordsCount, life } = settings.setting;
                changeSetting(isSound, showTranslate, showButton, wordsCount, life)
            } catch (e) {
                
            }
        }, []
    )
    
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data && data.wordsCount) {
            changeSetting(data.isSound, data.showTranslate, data.showButton, data.wordsCount, data.life);
        }
    }, [changeSetting])

    return { isSound, showTranslate, showButton, wordsCount, life, changeSetting, getSetting }
}
