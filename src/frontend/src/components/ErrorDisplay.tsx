import { useEffect, useState } from 'react';

/*interface ErrorObj {
    message: string,
    type: number
}*/

enum errorType {
    error = 1,
    information
}

function determineClass(type: number){
    switch(type){
        case errorType.error:
            return 'text-red-500';
        case errorType.information:
            return 'text-amber-500';
        default:
            return '';
    }
}

export default function ErrorDisplay({error, hideAfter = 5000, done}){
    const [, setVisible] = useState(false);

    // hide error after x miliseconds
    useEffect(() => {
        if(error && !error.noHide){
            const timeout = setTimeout(() => {
                done(null)
            }, hideAfter);

            setVisible(true);

            return () => clearTimeout(timeout);
        }
    }, [error, hideAfter, done]);

    if(!error){
        return null;
    }

    return (
        <div className={determineClass(error.type)}>
            {error.message}
        </div>
    );
}