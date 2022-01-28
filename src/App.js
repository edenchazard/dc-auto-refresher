import './App.css';
import Dragon from "./components/Dragon";
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import { useState } from 'react';
import { isCodeInList, validateCode } from "./functions.js";

export default function App() {
    const   [listOfDragons, updateListOfDragons] = useState([]),
            [rate, updateRate] = useState(250),
            [autorefresh, updateAutorefresh] = useState(false);

    function handleAdd(code, instances){
        // prevent people adding an already added code to the list
        if(isCodeInList(listOfDragons, code)){
            return;
        }

        if(!validateCode(code)){
            return;
        }

        const dragon = { code, instances};

        toggleAutorefresh(false);
        updateListOfDragons([...listOfDragons, dragon]);
    }

    function toggleAutorefresh(value){
        // if there's no dragons in the list, instant false
        if(listOfDragons.length === 0){
            updateAutorefresh(false);
            return;
        }

        if(value === undefined){
            value = !autorefresh;
        }
        updateAutorefresh(value);
    }

    function handleUpdateDragon(index, val){
        let dragons = listOfDragons;
        dragons[index] = {
            ...dragons[index],
            instances: val
        };
        toggleAutorefresh(false);
        updateListOfDragons([...dragons]);
    }

    function handleRemove(index){
        let dragons = listOfDragons.splice(index, 1);
        toggleAutorefresh(false);
        updateListOfDragons([...dragons]);
    }

    const createIframeDragons = function(){
        return listOfDragons.map((dragon) => `${dragon.code}:${dragon.instances}`)
            .join(',');
    };

    const iframeSrc = `refresher.html?rate=${rate}&dragonsStr=${createIframeDragons()}`
    return (
        <div className="App rounded-lg shadow-lg bg-slate-900 max-w-md mx-auto p-5 text-white min-h-screen">
            <RefresherControls
                rate={rate}
                autorefresh={autorefresh}
                update={(rate) => {toggleAutorefresh(false); updateRate(rate)}}
                click={() => toggleAutorefresh(!autorefresh) } />
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Code</th>
                        <th>Instances</th>
                        <th>Tools</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listOfDragons.map((dragon, index) => {
                            return (
                                <Dragon
                                    key={index}
                                    code={dragon.code}
                                    instances={dragon.instances}
                                    setInstances={(instances) => handleUpdateDragon(index, instances)}
                                    remove={() => handleRemove(index)} />
                            )
                        })
                    }
                    <AddDragon addToList={handleAdd} />
                </tbody>
            </table>
            {
                autorefresh && <iframe title="autorefresh region" src={iframeSrc} className='w-full'></iframe>
            } 
        </div>
    );
}
