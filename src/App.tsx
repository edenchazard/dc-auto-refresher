import './App.css';
import DragonTR from "./components/DragonTR";
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import { useEffect, useRef, useState } from 'react';
import { isCodeInList, validateCode, generateDragCaveImgUrl, 
        replaceFavicon } from "./functions";
import { Dragon } from "./interfaces";

function RefresherView({dragonList, rate}) {
    const [refresh, setRefresh] = useState<boolean>(false);

    // force a re-render every rate, this works because
    // the browser thinks the images are new every time
    // with the cachebust rendering the dragons
    useEffect(() => {
        const timeout = window.setTimeout(() => setRefresh(!refresh), rate);
        return () => window.clearTimeout(timeout);
    });

    return (
        <div className='w-full'>
            {
                dragonList.map((dragon: Dragon, index: number) => {
                    return (
                        Array.from(Array(dragon.instances), (e, it) => <img className='inline' src={generateDragCaveImgUrl(dragon.code)} key={`${index}.${it}`} alt={dragon.code} />)
                    )
                })
            }
        </div>
    );
}

export default function App() {
    const   [listOfDragons, setListOfDragons] = useState<Dragon[]>([]),
            [rate, setRate] = useState<number>(250),
            [autorefresh, setAutorefresh] = useState<boolean>(false);

    let curIconCycle = 0;
    const iconInterval = useRef<number | null>(null);

    // Code to cycle the favicon
    function handleIcon(active: boolean) {
        // when aring, cycle through the various dragons
        if(active){
            iconInterval.current = window.setInterval(() => {
                curIconCycle = !listOfDragons[curIconCycle + 1] ? 0 : curIconCycle + 1;
                replaceFavicon(generateDragCaveImgUrl(listOfDragons[curIconCycle].code));
            }, rate);
        }
        else{
            // revert favicon
            window.clearInterval(iconInterval.current);
            curIconCycle = 0;
            replaceFavicon('./logo192.png');
        }
    }

    function handleAdd(code: string, instances: number){
        // prevent people adding an already added code to the list
        if(isCodeInList(listOfDragons, code)){
            return;
        }

        if(!validateCode(code)){
            return;
        }

        const dragon: Dragon = { code, instances};

        toggleAutorefresh(false);
        setListOfDragons([...listOfDragons, dragon]);
    }

    function toggleAutorefresh(value: boolean){
        // if there's no dragons in the list, instant false
        if(listOfDragons.length === 0){
            setAutorefresh(false);
            return;
        }

        handleIcon(value);
        setAutorefresh(value);
    }

    function handleUpdateDragon(index: number, val: number){
        listOfDragons[index] = {
            ...listOfDragons[index],
            instances: val
        };
        toggleAutorefresh(false);
        setListOfDragons([...listOfDragons]);
    }

    function handleRemove(index: number){
        listOfDragons.splice(index, 1);
        toggleAutorefresh(false);
        setListOfDragons([...listOfDragons]);
    }

    return (
        <div className="App rounded-lg shadow-lg bg-slate-900 max-w-md mx-auto p-5 text-white min-h-screen">
            <AddDragon
                rate={rate}
                addToList={handleAdd} />
            <RefresherControls
                rate={rate}
                autorefresh={autorefresh}
                update={(rate) => {toggleAutorefresh(false); setRate(rate)}}
                click={() => toggleAutorefresh(!autorefresh) } />
            <div className='grid grid-cols-3 gap-4 my-2'>
                {
                    listOfDragons.map((dragon, index) => {
                        return (
                            <DragonTR
                                key={index}
                                code={dragon.code}
                                rate={rate}
                                instances={dragon.instances}
                                setInstances={(instances: number) => handleUpdateDragon(index, instances)}
                                remove={() => handleRemove(index)} />
                        )
                    })
                }
            </div>
            {
                autorefresh && <RefresherView dragonList={listOfDragons} rate={rate} />
            } 
        </div>
    );
}