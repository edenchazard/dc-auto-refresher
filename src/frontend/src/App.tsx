import { useEffect, useState } from 'react';

import ReactTooltip from 'react-tooltip';

import { Dragon } from "./app/interfaces";
import errMsg from "./app/errors";
import * as DCAPI from "./app/dcapi";
import TimingService from "./app/timing-service";
import { isCodeInList, validateCode, getListFromQS } from "./app/functions";
import useIconCycle from "./hooks/useIconCycle";
import Footer from "./components/Footer";
import DragonTR from "./components/DragonTR";
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import RefresherView from './components/RefresherView';
import ErrorDisplay from './components/ErrorDisplay';

import './App.css';

TimingService.start(1000);

const SESSION_KEY = 'session';

// if we have session data, use that, otherwise use defaults
const storedData = getSessionData();

// If supplied with a preset list, use that.
const preSet = (() => {
    const list = getListFromQS();
    if(list !== null)
        window.history.replaceState({list: ''}, '', window.location.pathname);
    return list;
})();

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
    const   [listOfDragons, setListOfDragons] = useState<Dragon[]>(preSet || get(storedData, 'listOfDragons',  [])),
            [rate, setRate] = useState<number>(get(storedData, 'rate', 250)),
            [autorefresh, setAutorefresh] = useState<boolean>(get(storedData, 'autorefresh', false)),
            [smartRemoval, setSmartRemoval] = useState<boolean>(get(storedData, 'smartRemoval', true)),
            [noView, setNoView] = useState<boolean>(get(storedData, 'noView', false)),
            [error, setError] = useState(null);

    // handle icon changes when auto refresh is active
    useIconCycle(autorefresh, listOfDragons);
    
    // persist our state between refreshes (missk asked for this)
    useEffect(() => {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
            listOfDragons, rate, autorefresh, smartRemoval, noView
        }));
    });

    // If we have no dragons to refresh, auto-refresh should always be false
    // This also prevents cases such as the auto-refresher removing hatched dragons
    // but undesirably continuing to auto-refresh
    useEffect(() => {
        if(!hasRefreshableDragons(listOfDragons)){
            setAutorefresh(false);
        }
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
                const orderedList = [...listOfDragons, { code, instances, tod: details.tod }];
                // https://stackoverflow.com/a/58748962
                orderedList.sort(({tod: a}, {tod: b}) => 
                    (a != null ? a : Infinity) - (b != null ? b : Infinity)
                );

                setListOfDragons(orderedList);
                setError(null);
                setAutorefresh(false);

                // fixes problem that stops the tooltip for TOD appearing
                ReactTooltip.rebuild();
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

            if(listOfDragons.length > 0)
                setError({ type: 1, message: errMsg.NOINSTANCES });
            else
                setError({ type: 1, message: errMsg.NODRAGONS });
        }

        setAutorefresh(value);
    }

    function handleUpdateDragon(index: number, val: number){
        listOfDragons[index] = {
            ...listOfDragons[index],
            instances: val
        };
        setAutorefresh(false);
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
        <div className='flex flex-col min-h-screen'>
            <ReactTooltip
                globalEventOff="click"
                place="top"
                effect="solid" />
            <main className="App rounded-lg shadow-lg bg-slate-900 max-w-md mx-auto text-white grow">
                <div className='max:pt-3'>
                    <section className='max:px-5'>
                        <AddDragon
                            rate={rate}
                            addToList={handleAdd} />
                    </section>
                    <section className='px-5 my-3'>
                        <RefresherControls
                            list={listOfDragons}
                            rate={rate}
                            smartRemoval={smartRemoval}
                            autorefresh={autorefresh}
                            updateRate={(rate: number) => {setAutorefresh(false); setRate(rate)}}
                            click={() => toggleAutorefresh(!autorefresh)}
                            updateSmartRemoval={(value: boolean) => setSmartRemoval(value) }
                            noView={noView}
                            updateNoView={(value: boolean) => setNoView(value)} />
                        <ErrorDisplay
                            error={error}
                            done={setError} />
                        <div className='grid grid-cols-2 gap-4 my-2 threecol:grid-cols-3'>
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
                    </section>
                    {
                        autorefresh &&
                        <section className='px-5 my-3'>
                            <RefresherView
                                dragonList={listOfDragons}
                                rate={rate}
                                onImageChange={handleImageChange}
                                disableViews={noView} />
                        </section>
                    }
                </div>
            </main>
            <Footer />
        </div>
    );
}