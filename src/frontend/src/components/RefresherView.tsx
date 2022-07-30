import { useEffect, useRef, useState } from 'react';

import { Size, Dragon } from "../app/interfaces";
import { generateDragCaveImgUrl, sizesSame } from "../app/functions";

interface RefresherViewProps {
    dragonList: Dragon[],
    rate: number,
    onImageChange?: Function
}

export default function RefresherView({ dragonList, rate, onImageChange }: RefresherViewProps) {
    const [instance, setInstance] = useState<number>(1);
    const sizes = useRef<Size[]>([]);

    // force a re-render every rate, this works because
    // the browser thinks the images are new every time
    // with the cachebust rendering the dragons
    useEffect(() => {
        if(rate === 0) return;

        const timeout = setInterval(() => setInstance((prev) => prev + 1), rate);
        return () => clearInterval(timeout);
    }, [rate]);

    // we try to detect changes in the image's h/w after load
    // and assume if there's any change, that the
    // dragon has been fogged/hatched/adulted/died
    // this is more efficient, faster than constantly polling the DC API
    function measureSize(img: HTMLImageElement){
        const   
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

    function handleLoad(event){
        const
            img: HTMLImageElement = event.target,
            code: string = img.dataset.code;

        // run size measuring for smart removal, if enabled
        onImageChange && measureSize(img);

        // we only run this if the rate is 0, "performance" mode
        console.log(rate)
        if(rate === 0){
            console.log('test')
            // immediately replace the src with a new one
            img.src = generateDragCaveImgUrl(code);
        }
    }

    return (
        <div className='w-full'>
            {
                (rate > 0
                    ? <p>Refreshing every {rate/1000}s (cycle #{instance})</p>
                    : <p>Refreshing at device rate</p>
                )
            }
            
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
                                onLoad={handleLoad} />)
                        )
                    })
                }
            </div>
        </div>
    );
}