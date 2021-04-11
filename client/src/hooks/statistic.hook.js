import {useCallback} from 'react';
import Storage from '../helper/Storage';

const useStatistic = () => {

    const setStatistic = (obj, id = null, token = null) => {
        if (id === null) return Storage.setSettingStorage(obj);

        putWordsCount(obj, id, token)
    }

    const putWordsCount =
        async (obj, id, token) => {
            try {
                await fetch(`/users/${id}/statistics`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        learnedWords: {
                            date: new Date(),
                            word: obj
                        }
                    })
                })
            } catch (e) {

            }
        }

    return {setStatistic}
}

export default useStatistic;
