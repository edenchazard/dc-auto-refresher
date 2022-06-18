import { useEffect, useRef, useState } from 'react';

import { Size, Dragon } from "../app/interfaces";
import { generateDragCaveImgUrl, sizesSame } from "../app/functions";

export default function RefresherView({dragonList, rate, onImageChange}) {
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