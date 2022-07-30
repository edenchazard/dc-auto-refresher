import { useEffect, useRef, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';

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

    function updateImage(img: HTMLImageElement){
        const code: string = img.dataset.code;

        // immediately replace the src with a new one
        img.src = generateDragCaveImgUrl(code);
    }

    function handleLoad(event){
        const img: HTMLImageElement = event.target;

        // run size measuring for smart removal, if enabled
        onImageChange && measureSize(img);

        // we only run this if the rate is in adaptive mode
        if(rate === 0){
            updateImage(img);
        }
    }

    // handle image failures in adaptive mode
    function handleError(event){
        if(rate === 0){
            const img: HTMLImageElement = event.target;

            // try again in 2s
            setTimeout(() => updateImage(img), 2000);
        }
    }

    return (
        <div className='w-full'>
            <p>
                <FontAwesomeIcon icon={faRefresh} className='spin' />
            {
                (rate > 0
                    ? ` Refreshing every ${rate/1000}s (cycle #${instance})`
                    : " Refreshing at device rate"
                )
            }
                
            </p>
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
                                onLoad={handleLoad}
                                onError={handleError} />)
                        )
                    })
                }
            </div>
        </div>
    );
}