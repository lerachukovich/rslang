import {useState, useCallback, useEffect} from 'react';

const storageName = 'userDataRSLang';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [name, setName] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [timeLogin, setTimeLogin] = useState(null);

    const login = useCallback((jwtToken, id, picture, nicName) => {
        const time = new Date().toISOString();
        setToken(jwtToken);
        setUserId(id);
        setName(nicName);
        setPhoto(picture)
        setTimeLogin(time)

        localStorage.setItem(storageName, JSON.stringify({token: jwtToken, userId: id, name: nicName, photo: picture, timeLogin: time}));
    }, [])

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setName(null);
        setPhoto(null)
        localStorage.removeItem(storageName);
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));

        if (data && data.token) {
            login(data.token, data.userId, data.photo, data.name);
        }
    }, [login])

    return { login, logout, token, userId, name, photo, timeLogin}
}
