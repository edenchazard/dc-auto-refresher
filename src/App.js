import './App.css';
import Dragon from "./components/Dragon";
import AddDragon from './components/AddDragon';
import { useState } from 'react';
import { isCodeInList, validateCode } from "./functions.js";

const settings ={
    minRate: 200
};

export default function App() {
    const [listOfDragons, updateListOfDragons] = useState([]);
    const [rate, updateRate] = useState(settings.minRate);

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
            repeat: 1
        };

        updateListOfDragons([...listOfDragons, dragon]);
    }

    function beginRefreshing(){

    }

    function handleUpdateDragon(index, val){
        let dragons = listOfDragons;
        dragons[index] = {
            ...dragons[index],
            repeat: val
        };
        console.log(dragons);
        updateListOfDragons([...dragons]);
    }

    function handleRemove(index){
        let dragons = listOfDragons;
        dragons.splice(index, 1);
        console.log("removing", index)
        updateListOfDragons([...dragons]);
    }

    return (
        <div className="App">
            <table className="table-auto">
                <thead>
                    <th>Image</th>
                    <th>Code</th>
                    <th>Repeat</th>
                    <th>Tools</th>
                </thead>
                <tbody>
                    {
                        listOfDragons.map((dragon, index) => {
                            return (
                            <Dragon
                                key={index}
                                code={dragon.code}
                                repeat={dragon.repeat}
                                updateRepeat={(repeatFor) => handleUpdateDragon(index, repeatFor)}
                                remove={() => handleRemove(index)} />
                            )
                        })
                    }
                    <AddDragon
                        addToList={handleAdd} />
                </tbody>
            </table>
            <div>
                <input 
                    type='number'
                    value={settings.minRate}
                    min="200"
                    onChange={(e) => { updateRate(e.target.value) }} />
                <button onClick={beginRefreshing}>Begin autorefreshing</button>
            </div>
        </div>
    );
}
