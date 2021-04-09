import React, { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    CartesianGrid
} from 'recharts';
import {format, parseISO, subDays, subMonths} from 'date-fns';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

const getArrayWords = (arr, length) => {
    return arr.reduce((a, cur) => {
    	if (!a.join) a = [a]
      
      let last = a[a.length - 1];
      
      if (!last.join && last.date.slice(0, length) === cur.date.slice(0, length)) {
        a[a.length - 1] = [last, cur]
      } else if (last.join && last[0].date.slice(0, length) === cur.date.slice(0, length)) {
      	a[a.length - 1].push(cur)
      } else a.push(cur)
      
      return a;
    }).map(item => item.join ? item : [item])
}

const getData = (arr, length, fn, count) => {
    const data = [];
    for (let num = count; num >= 0; num--) {
        const time = fn(new Date(), num).toISOString().slice(0, length);
        const leng = arr.filter(i => i[0].date.slice(0, length) === time)[0];
        if (Array.isArray(leng) && leng.length > 0) {
            data.push({
                date: time,
                value: leng.length
            })
        } else {
            data.push({
                date: time,
                value: 0
            })
        }        
    }
    return data;
}

const StatisticGlobal = ({statistic}) => {
    const [dataMonth, setDataMonth] = useState([]);
    const [dataYear, setDataYear] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [words, setWords] = useState([]);

    useEffect(() => {
        if (statistic.join && statistic.length > 0) {
            setDataMonth(getData(getArrayWords(statistic, 10), 10, subDays, 30));
            setDataYear(getData(getArrayWords(statistic, 7), 7, subMonths, 12))
        }
    }, [statistic])

    const handleClick = ({date}) => {        
        const arr = getArrayWords(statistic, date.length);
        setWords(arr.filter(i => i[0].date.slice(0, date.length) === date)[0].map(i => i.word))
        setIsOpen(true);
    }
        
    const playSound = url => {
        const audio = new Audio(`/${url}`);
        audio.play();
    }

    if (dataMonth.length > 0) {
        return (
            <Tabs>
                <TabList onClick={() => setIsOpen(false)}>
                    <Tab>За месяц</Tab>
                    <Tab>За год</Tab>
                </TabList>
                    
                <TabPanel>
                    <>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart 
                            data={dataMonth}  
                            width={10} 
                            height={40}>
                            <Bar dataKey="value" fill="#8884d8" onClick={handleClick} />
                            <XAxis dataKey="date" 
                                tickFormatter={(str) => {
                                    const date = parseISO(str);
                                    if (date.getDate() % 5 === 0) {
                                    return format(date, "MMM, d");
                                    }
                                    return "";
                                }}/>
                            <YAxis dataKey="value" />
                            <CartesianGrid opacity={0.5} />
                            <Tooltip content={<CustomTooltip />} />
                        </BarChart>
                    </ResponsiveContainer>
                    {
                        isOpen && words.length > 0 && (
                            <ul className="collection">
                                {
                                    words.map((word, idx) => {
                                        return (
                                            <li className="collection-item" key={idx}>
                                                <i className="small material-icons" onClick={playSound.bind(null, word.audio)}>volume_up</i>
                                                <span>{word.word}</span>
                                                <span>{word.transcription}</span>
                                                <span>{word.wordTranslate}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        )
                    }
                    </>
                </TabPanel>
                <TabPanel>
                    <>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart 
                            data={dataYear}  
                            width={10} 
                            height={40}>
                            <Bar dataKey="value" fill="#8884d8" onClick={handleClick} />
                            <XAxis dataKey="date" 
                                tickFormatter={(str) => {
                                    const date = parseISO(str);
                                    return format(date, "MMM yyyy");
                                }} />
                            <YAxis dataKey="value" />
                            <CartesianGrid opacity={0.5} />
                            <Tooltip content={<CustomTooltip />} />
                        </BarChart>
                    </ResponsiveContainer>
                    {
                        isOpen && words.length > 0 && (
                            <ul className="collection">
                                {
                                    words.map((word, idx) => {
                                        return (
                                            <li className="collection-item" key={idx}>
                                                <i className="small material-icons" onClick={playSound.bind(null, word.audio)}>volume_up</i>
                                                <span>{word.word}</span>
                                                <span>{word.transcription}</span>
                                                <span>{word.wordTranslate}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        )
                    }
                    </>
                </TabPanel>
            </Tabs>            
        )
    } else {
        return (
            <h2>Статистика не обнаружена</h2>
        )
    }
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip">
            <p className="label">{`Дата: ${payload[0].payload.date}`}</p>
            <p className="label">{`Слов: ${payload[0].value}`}</p>
        </div>
      );
    }
  
    return null;
  };

export default StatisticGlobal;
