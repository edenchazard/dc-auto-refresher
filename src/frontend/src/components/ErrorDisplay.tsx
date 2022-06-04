import { useEffect, useState } from 'react';

/*interface errorMsg {
    type: errorType,
    message: String,
    noHide?: Boolean
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

    useEffect(() => {
        // hide error after x miliseconds if nohide disabled
        if(error && !error.noHide){
            setVisible(true);
            const timeout = setTimeout(() => done(null), hideAfter);

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