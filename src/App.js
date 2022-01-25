import logo from './logo.svg';
import './App.css';
import Dragon from "./components/Dragon";
import { useState } from 'react';
import { isCodeInList, validateCode } from "./functions.js"

function App() {
    const [listOfDragons, updateListOfDragons] = useState([{
        code: "xxxxx",
        repeat: 4
    }]);
    const [codeToAdd, updateNewCode] = useState("");


    function addDragon(){
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

    return (
        <div className="App">
            <table>
                <tbody>
                    {
                        listOfDragons.map((dragon, index) => {
                            return (
                            <Dragon
                                key={index}
                                code={dragon.code}
                                updateRepeat="change"/>
                            )
                        })
                    }
                </tbody>
            </table>
            <div>
                Code:
                <input type='text' onChange={(e) => updateNewCode(e.target.value)}/>
                <button onClick={addDragon}>Add</button>
            </div>
        </div>
    );
}

export default App;
