import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SettingContext } from '../context/SettingContext';
import '../styles/Setting.page.scss';

const SettingsPage = () => {
  const setting = useContext(SettingContext);
  const [isSound, setIsSound] = useState(null);
  const [showTranslate, setShowTranslate] = useState(null);
  const [showButton, setShowButton] = useState(null);
  const [wordsCount, setWordsCount] = useState(null);
  const [life, setLife] = useState(null);

  useEffect(() => {
    setIsSound(setting.isSound)
    setShowTranslate(setting.showTranslate)
    setShowButton(setting.showButton)
    setWordsCount(setting.wordsCount)
    setLife(setting.life)
  }, [setting])

  const auth = useContext(AuthContext);

  const [showSubmit, setShowSubmit] = useState(false);

  return(
    <div className="login-page-wrapper colored">
      <div className="settings-container card text-white bg-primary mb-3 login-form">
        <h3 className={'settings-title'}>Настройки</h3>
        <div className="setting-counter">
          <span>Звуковые эффекты</span>
          <div className="switch">
            <label>
              Выкл
              <input type="checkbox" checked={isSound} onChange={() => {
                setShowSubmit(true);
                setIsSound(prev => !prev);
              }} />
              <span className="lever"></span>
              Вкл
            </label>
          </div>
        </div>
        <div className="setting-counter">
          <span>Показывать перевод в списках слов</span>
          <div className="switch">
            <label>
              Выкл
              <input type="checkbox" checked={showTranslate} onChange={() => {
                setShowSubmit(true);
                setShowTranslate(prev => !prev);
              }} />
              <span className="lever"></span>
              Вкл
            </label>
          </div>
        </div>
        <div className="setting-counter">
          <span>Показывать кнопки "Сложные слова", "Удалённые слова" в словаре</span>
          <div className="switch">
            <label>
              Выкл
              <input type="checkbox" checked={showButton} onChange={() => {
                setShowSubmit(true);
                setShowButton(prev => !prev);
              }} />
              <span className="lever"></span>
              Вкл
            </label>
          </div>
        </div>
        <div className="setting-counter">
          <span>Количество слов в раунде:</span>
          <div className="setting-counter__list">
            {new Array(3).fill().map((_, idx) => (
                <p key={idx}>
                  <label>
                    <input name="group1" type="radio" checked={wordsCount === (idx * 5 + 10)} onChange={() => {
                      setShowSubmit(true);
                      setWordsCount(idx * 5 + 10);
                    }} />
                    <span>{(idx * 5) + 10}</span>
                  </label>
                </p>
              ))}
          </div>
        </div>
        <div className="setting-counter">
          <span>Количество жизней в играх:</span>
          <div className="setting-counter__list">
            {new Array(3).fill().map((_, idx) => (
                <p key={idx}>
                  <label>
                    <input name="group2" type="radio" checked={life === (idx * 2 + 1)} onChange={() => {
                      setShowSubmit(true);
                      setLife(idx * 2 + 1);
                    }} />
                    <span>{(idx * 2) + 1}</span>
                  </label>
                </p>
              ))}
          </div>
        </div>
        {showSubmit && (
          <div>
            <button className="waves-effect waves-light btn pulse" type="submit" onClick={() => {
              setTimeout(() => {
                setShowSubmit(false);
              }, 500);
              setting.changeSetting(isSound, showTranslate, showButton, wordsCount, life, auth.userId || null, auth.token || null);
            }}>Сохранить</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsPage;
