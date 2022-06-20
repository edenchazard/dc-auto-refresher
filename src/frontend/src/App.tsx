import { useEffect, useState } from 'react';

import { Dragon } from "./app/interfaces";
import errMsg from "./app/errors";
import * as DCAPI from "./app/dcapi";
import { isCodeInList, validateCode } from "./app/functions";
import useIconCycle from "./hooks/useIconCycle";
import Footer from "./components/Footer";
import DragonTR from "./components/DragonTR";
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import RefresherView from './components/RefresherView';
import ErrorDisplay from './components/ErrorDisplay';
import { Clock } from './components/Clock';

import './App.css';

const SESSION_KEY = 'session';

// if we have session data, use that, otherwise use defaults
const storedData = getSessionData();

function getSessionData(){
    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : {};
}

function hasRefreshableDragons(listOfDragons: Dragon[]){
    return listOfDragons.findIndex(dragon => dragon.instances > 0) > -1;
}

// checks the session storage for the specified key
// and returns the value, otherwise returns the 
// default value
function get(session: object, key: string, defaultValue: any){
    return key in session ? session[key] : defaultValue;
}

export default function App() {
    const   [listOfDragons, setListOfDragons] = useState<Dragon[]>(get(storedData, 'listOfDragons',  [])),
            [rate, setRate] = useState<number>(get(storedData, 'rate', 250)),
            [autorefresh, setAutorefresh] = useState<boolean>(get(storedData, 'autorefresh', false)),
            [smartRemoval, setSmartRemoval] = useState<boolean>(get(storedData, 'smartRemoval', true)),
            [error, setError] = useState(null);

    // handle icon changes when auto refresh is active
    useIconCycle(autorefresh, listOfDragons);
    
    // persist our state between refreshes (missk asked for this)
    useEffect(() => {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            listOfDragons, rate, autorefresh, smartRemoval
        }));
    });

    // If we have no dragons to refresh, auto-refresh should always be false
    // This also prevents cases such as the auto-refresher removing hatched dragons
    // but undesirably continuing to auto-refresh
    useEffect(() => {
        if(!hasRefreshableDragons(listOfDragons))
            setAutorefresh(false);
    }, [listOfDragons])

    async function handleAdd(code: string, instances: number, tod: number|null){
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
        if(!hasRefreshableDragons(listOfDragons)){
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
                    <label htmlFor="timer">Local time:</label>
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
                                tod={dragon.tod}
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