import './App.css';
import DragonTR from "./components/DragonTR";
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import { useState } from 'react';
import { isCodeInList, validateCode } from "./functions";
import { Dragon } from "./interfaces";

export default function App() {
    const   [listOfDragons, setListOfDragons] = useState<Dragon[]>([]),
            [rate, setRate] = useState<number>(250),
            [autorefresh, setAutorefresh] = useState<boolean>(false);

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

    const createIframeDragons = listOfDragons
        .map((dragon) => `${dragon.code}:${dragon.instances}`)
        .join(',');

    const iframeSrc = `refresher.html?rate=${rate}&dragonsStr=${createIframeDragons}`;

    return (
        <div className="App rounded-lg shadow-lg bg-slate-900 max-w-md mx-auto p-5 text-white min-h-screen">
            <RefresherControls
                rate={rate}
                autorefresh={autorefresh}
                update={(rate) => {toggleAutorefresh(false); setRate(rate)}}
                click={() => toggleAutorefresh(!autorefresh) } />
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Code</th>
                        <th>Instances</th>
                        <th>
                            <abbr title="views per minute">V/M</abbr>
                        </th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listOfDragons.map((dragon, index) => {
                            return (
                                <DragonTR
                                    key={index}
                                    code={dragon.code}
                                    rate={rate}
                                    instances={dragon.instances}
                                    setInstances={(instances) => handleUpdateDragon(index, instances)}
                                    remove={() => handleRemove(index)} />
                            )
                        })
                    }
                    <AddDragon
                        rate={rate}
                        addToList={handleAdd} />
                </tbody>
            </table>
            {
                autorefresh && <iframe title="autorefresh region" src={iframeSrc} className='w-full'></iframe>
            } 
        </div>
    );
}