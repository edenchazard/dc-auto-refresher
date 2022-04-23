import './App.css';
import Header from "./components/Header";
import DragonTR from "./components/DragonTR";
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import { useEffect, useRef, useState } from 'react';
import { isCodeInList, validateCode, generateDragCaveImgUrl, 
        replaceFavicon, sizesSame } from "./functions";
import { Dragon, Size } from "./interfaces";
import DCAPI from "./dcapi";

const STORAGE_KEY = 'session-data';

function RefresherView({dragonList, rate, onImageChange}) {
    const [refresh, setRefresh] = useState<boolean>(false);
    const sizes = useRef<Size[]>([]);

    // force a re-render every rate, this works because
    // the browser thinks the images are new every time
    // with the cachebust rendering the dragons
    useEffect(() => {
        const timeout = window.setTimeout(() => setRefresh(!refresh), rate);
        return () => window.clearTimeout(timeout);
    });

    // we try to detect changes in the image's h/w after load
    // and assume if there's any change, that the
    // dragon has been fogged/hatched/adulted/died
    // this is more efficient, faster than constantly polling the DC API
    function measureSize(event){
        const   img: HTMLImageElement = event.target,
                newSize: Size = { w: img.naturalWidth, h: img.naturalHeight },
                code: string = img.dataset.code;

        // this is the first time we've grabbed the size
        if(sizes.current[code] !== undefined){
            // a size change indicates a change in status
            if(!sizesSame(sizes.current[code], newSize)){
                onImageChange(code);
            }
        }
        // update with new measurements
        sizes.current[code] = newSize;
    }

    return (
        <div className='w-full'>
            {
                dragonList.map((dragon: Dragon, index: number) => {
                    return (
                        Array.from(Array(dragon.instances), (e, it) => 
                        <img className='inline'
                            src={generateDragCaveImgUrl(dragon.code)}
                            key={`${index}.${it}`}
                            alt={dragon.code}
                            data-code={dragon.code}
                            onLoad={measureSize} />)
                    )
                })
            }
        </div>
    );
}

export default function App() {
    // if we have session data, use that, otherwise use defaults
    const storedData = getStoredData();

    const   [listOfDragons, setListOfDragons] = useState<Dragon[]>(storedData.listOfDragons || []),
            [rate, setRate] = useState<number>(storedData.rate || 250),
            [autorefresh, setAutorefresh] = useState<boolean>(storedData.autorefresh || false),
            [smartRemoval, setSmartRemoval] = useState<boolean>(storedData.smartRemoval || true);

    let curIconCycle = 0;
    const iconInterval = useRef<number | null>(null);

    // persist our state between refreshes (missk asked for this)
    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            listOfDragons, rate, autorefresh, smartRemoval
        }));
    });

    function getStoredData(){
        const session = sessionStorage.getItem(STORAGE_KEY);
        return session ? JSON.parse(session) : {};
    }
    
    // Code to cycle the favicon
    function handleIcon(active: boolean) {
        // when aring, cycle through the various dragons
        if(active){
            iconInterval.current = window.setInterval(() => {
                curIconCycle = !listOfDragons[curIconCycle + 1] ? 0 : curIconCycle + 1;
                const code = listOfDragons[curIconCycle].code;
                replaceFavicon(generateDragCaveImgUrl(code, true));
                document.title = code;
            }, 1000);
        }
        else{
            // revert favicon
            window.clearInterval(iconInterval.current);
            curIconCycle = 0;
            replaceFavicon('./logo192.png');
            document.title = process.env.REACT_APP_APP_TITLE;
        }
    }

    async function handleAdd(code: string, instances: number){
        // prevent people adding an already added code to the list
        if(isCodeInList(listOfDragons, code)){
            return;
        }

        if(!validateCode(code)){
            return;
        }
        try {
            const details = await DCAPI.checkDragon(code);
            // not a frozen, hidden or adult dragon
            if(details.acceptable){
                toggleAutorefresh(false);
                setListOfDragons([...listOfDragons, { code, instances }]);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    function toggleAutorefresh(value: boolean){
        // if there's no dragons in the list, instant false
        if(listOfDragons.length === 0){
            value = false;
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
        removeDragon(index);
    }

    function removeDragon(index: number){
        listOfDragons.splice(index, 1);
        setListOfDragons([...listOfDragons]);

        // if no more dragons ARing, then disable AR
        if(listOfDragons.length === 0){
            toggleAutorefresh(false);
        }
    }

    async function handleImageChange(code: string){
        // console.log("NEW SIZE FOR "+code);
        // if SR isn't enabled, just stay as normal.
        if(!smartRemoval){
            return;
        }

        try {
            const details = await DCAPI.checkDragon(code);

            // continue with SR checks
            if(details.justHatched || !details.acceptable){
                // console.log("SMART REMOVAL FOR "+code);
                // confirmed to be something we should remove.
                removeDragon(listOfDragons.findIndex((dragon) => dragon.code === code));
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="App rounded-lg shadow-lg bg-slate-900 max-w-md mx-auto p-5 text-white min-h-screen">
            <AddDragon
                rate={rate}
                addToList={handleAdd} />
            <RefresherControls
                rate={rate}
                smartRemoval={smartRemoval}
                autorefresh={autorefresh}
                updateRate={(rate: number) => {toggleAutorefresh(false); setRate(rate)}}
                click={() => toggleAutorefresh(!autorefresh) }
                updateSmartRemoval={(value: boolean) => setSmartRemoval(value) } />
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
                autorefresh &&
                <RefresherView
                    dragonList={listOfDragons}
                    rate={rate}
                    onImageChange={handleImageChange} />
            } 
            <Header />
        </div>
    );
}