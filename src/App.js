import './App.css';
import Dragon from "./components/Dragon";
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import { useState } from 'react';
import { isCodeInList, validateCode } from "./functions.js";

export default function App() {
    const [listOfDragons, updateListOfDragons] = useState([]);
    const [rate, updateRate] = useState(250);
    const [autorefresh, updateAutorefresh] = useState(false);

    function handleAdd(codeToAdd){
        // prevent people adding an already added code to the list
        if(isCodeInList(listOfDragons, codeToAdd)){
            return;
        }

        if(!validateCode(codeToAdd)){
            return;
        }

        const dragon = {
            code: codeToAdd,
            instances: 1
        };

        updateListOfDragons([...listOfDragons, dragon]);
    }

    function toggleAutorefresh(){
        updateAutorefresh(!autorefresh);
    }

    function handleUpdateDragon(index, val){
        let dragons = listOfDragons;
        dragons[index] = {
            ...dragons[index],
            instances: val
        };
        updateListOfDragons([...dragons]);
    }

    function handleRemove(index){
        let dragons = listOfDragons;
        dragons.splice(index, 1);
        updateListOfDragons([...dragons]);
    }

    const createIframeDragons = function(){
        return listOfDragons.map((dragon) => `${dragon.code}:${dragon.instances}`).join(',');
    };

    const iframeSrc = `./refresher.html?rate=${rate}&dragonsStr=${createIframeDragons()}`
    return (
        <div className="App">
            <table className="table-auto">
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
                                    updateInstances={(instances) => handleUpdateDragon(index, instances)}
                                    remove={() => handleRemove(index)} />
                            )
                        })
                    }
                    <AddDragon addToList={handleAdd} />
                </tbody>
            </table>
            <RefresherControls
                rate={rate}
                update={(rate) => {console.log(rate); updateRate(rate)}}
                click={toggleAutorefresh} />
            {
                autorefresh ? <iframe src={iframeSrc}></iframe> : ""
            } 
        </div>
    );
}
