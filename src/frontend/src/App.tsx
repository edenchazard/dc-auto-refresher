import { useEffect, useRef, useState } from 'react';
import Footer from "./components/Footer";
import DragonTR from "./components/DragonTR";
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import ErrorDisplay from './components/ErrorDisplay';
import { Clock } from './components/Clock';
import useIconCycle from "./hooks/useIconCycle";
import { isCodeInList, validateCode, generateDragCaveImgUrl, 
        sizesSame } from "./app/functions";
import { Dragon, Size } from "./app/interfaces";
import DCAPI from "./app/dcapi";
import errMsg from "./app/errors";
import './App.css';

const SESSION_KEY = 'session';

function getSessionData(){
    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : {};
}

function RefresherView({dragonList, rate, onImageChange}) {
    const [instance, setInstance] = useState<number>(1);
    const sizes = useRef<Size[]>([]);

    // force a re-render every rate, this works because
    // the browser thinks the images are new every time
    // with the cachebust rendering the dragons
    useEffect(() => {
        const timeout = setInterval(() => setInstance((prev) => prev + 1), rate);
        return () => clearInterval(timeout);
    }, [rate]);

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
            <p>Refreshing every {rate/1000}s (#{instance})</p>
            <div>
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
        </div>
    );
}

export default function App() {
    // if we have session data, use that, otherwise use defaults
    const storedData = getSessionData();

    const   [listOfDragons, setListOfDragons] = useState<Dragon[]>(storedData.listOfDragons || []),
            [rate, setRate] = useState<number>(storedData.rate || 250),
            [autorefresh, setAutorefresh] = useState<boolean>(storedData.autorefresh || false),
            [smartRemoval, setSmartRemoval] = useState<boolean>(storedData.smartRemoval || true),
            [error, setError] = useState(null);

    // handle icon changes when auto refresh is active
    useIconCycle(autorefresh, listOfDragons);
    
    // persist our state between refreshes (missk asked for this)
    useEffect(() => {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            listOfDragons, rate, autorefresh, smartRemoval
        }));
    });

    async function handleAdd(code: string, instances: number, tod:  number|undefined){
        console.log(tod);
        // prevent people adding an already added code to the list
        if(isCodeInList(listOfDragons, code)){
            setError({ type: 1, message: errMsg.ALREADYINLIST });
            return;
        }
        if(!validateCode(code)){
            setError({ type: 1, message: errMsg.BADCODE });
            return;
        }

        try {
            setError({ type: 2, message: errMsg.CHECKINGAPI, noHide: true });
            const details = await DCAPI.checkDragon(code, tod);

            if(details.errors){
                setError({ type: 1, message: details.errorMessage });
                return;
            }

            // not a frozen, hidden or adult dragon
            if(details.acceptable){
                toggleAutorefresh(false);
                setListOfDragons([...listOfDragons, { code, instances, tod: details.tod }]);
                setError(null);
            }
            else{
                setError({ type: 1, message: errMsg.BADDRAGON });
            }
        }
        catch (error) {
            setError({ type: 1, message: errMsg.BADCONNECTION + " " + error.message});
        }
    }

    function toggleAutorefresh(value: boolean){
        // if there's no dragons in the list, instant false
        if(listOfDragons.length === 0){
            value = false;
        }

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
            if(details.errors){
                setError({ type: 1, message: details.errorMessage });
            }
            else if(details.justHatched || !details.acceptable){
                // console.log("SMART REMOVAL FOR "+code);
                // confirmed to be something we should remove.
                removeDragon(listOfDragons.findIndex((dragon) => dragon.code === code));
            }
        }
        catch (error) {
            setError({ type: 1, message: errMsg.BADCONNECTION + " " + error.message});
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
            <div className="flex items-center justify-between my-2">
                <span>
                    <label htmlFor="timer">Time:</label>
                </span>
                <span role="timer" id='timer'>
                    <Clock />
                </span>
            </div>
            <ErrorDisplay
                error={error}
                done={setError} />
            <div className='grid grid-cols-3 gap-4 my-2'>
                {
                    listOfDragons.map((dragon, index) => {
                        return (
                            <DragonTR
                                key={dragon.code}
                                code={dragon.code}
                                rate={rate}
                                tod={new Date(dragon.tod)}
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
            <Footer />
        </div>
    );
}