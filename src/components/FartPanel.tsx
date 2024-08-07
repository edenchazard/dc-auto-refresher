'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useLocalStorage, useSessionStorage } from 'usehooks-ts';
import type { Dragon } from '../app/types';
import errMsg from '../app/errors';
import * as DCAPI from '../app/dcapi';
import TimingService from '../app/timing-service';
import {
  hasRefreshableDragons,
  isCodeInList,
  validateCode,
} from '../utils/functions';
import useIconCycle from '../hooks/useIconCycle';
import useParseListPreset from '../hooks/useParseListPreset';
import DragonTR from '../components/DragonTR';
import AddDragon from '../components/AddDragon';
import RefresherControls from '../components/RefresherControls';
import RefresherView from '../components/RefresherView';
import { ErrorDisplay } from '../components/ErrorDisplay';
import type { ErrorMessage } from '../components/ErrorDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const checkingQueue = new Set<string>([]);

function Heading({ children }: { children: React.ReactNode }) {
  return (
    // <div className="relative flex items-center gap-5">
    //  <div className="flex-grow border-t border-gray-400"></div>
    <h2 className="text-center">{children}</h2>
    //   <div className="flex-grow border-t border-gray-400"></div>
    // </div>
  );
}

export default function FartPanel() {
  const [listOfDragons, setListOfDragons] = useSessionStorage<Dragon[]>(
    'listOfDragons',
    [],
  );
  const [rate, setRate] = useLocalStorage('rate', 250);
  const [autorefresh, setAutorefresh] = useSessionStorage('autorefresh', false);
  const [smartRemoval, setSmartRemoval] = useSessionStorage(
    'smartRemoval',
    true,
  );
  const [noView, setNoView] = useSessionStorage('noView', false);
  const [error, setError] = useState<ErrorMessage>(null);
  const [showGardenBanner, setShowGardenBanner] = useLocalStorage(
    'garden-banner',
    true,
  );

  // handle icon changes when auto refresh is active
  useIconCycle(
    autorefresh,
    listOfDragons,
    process.env.NEXT_PUBLIC_BASE_URL + '/logo192.png',
  );

  // Was a preset list param specified?
  useParseListPreset(setListOfDragons, true);

  useEffect(() => {
    TimingService.start(1000);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        TimingService.stop();
      } else {
        TimingService.notify();
        TimingService.start(1000);
      }
    });
  }, []);

  // If we have no dragons to refresh, auto-refresh should always be false.
  // This also prevents cases such as the auto-refresher removing hatched dragons
  // but undesirably continuing to auto-refresh
  // We also have to check the autorefresh state isn't already false,
  // or we create a depth stack problem because of the usesessionstorage
  // hook
  useEffect(() => {
    if (autorefresh && !hasRefreshableDragons(listOfDragons)) {
      setAutorefresh(false);
    }
  }, [listOfDragons, autorefresh, setAutorefresh]);

  function handleAdd(dragon: Dragon) {
    const add = async () => {
      // prevent people adding an already added code to the list
      if (isCodeInList(listOfDragons, dragon.code)) {
        setError({ type: 1, message: errMsg.ALREADYINLIST });
        return;
      }
      if (!validateCode(dragon.code)) {
        setError({ type: 1, message: errMsg.BADCODE });
        return;
      }
      try {
        setError({ type: 2, message: errMsg.CHECKINGAPI, noHide: true });
        const { errors, data } = await DCAPI.checkDragon(
          dragon.code,
          dragon.tod,
        );

        if (errors.length > 0) {
          setError({ type: 1, message: errors.join(' ') });
          return;
        }

        // not a frozen, hidden or adult dragon
        if (data.acceptable) {
          const orderedList = [
            ...listOfDragons,
            {
              code: dragon.code,
              instances: dragon.instances,
              tod: data.tod,
              enabled: true,
            },
          ];

          // https://stackoverflow.com/a/58748962
          orderedList.sort(
            ({ tod: a }, { tod: b }) =>
              (a !== null ? a : Infinity) - (b !== null ? b : Infinity),
          );

          setListOfDragons(orderedList);
          setError(null);
          setAutorefresh(false);
        } else {
          setError({ type: 1, message: errMsg.BADDRAGON });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError({
            type: 1,
            message: `${errMsg.BADCONNECTION} ${error.message}`,
          });
        }
      }
    };

    void add();
  }

  function toggleAutorefresh(value: boolean) {
    // if there's no dragons in the list, instant false
    if (!hasRefreshableDragons(listOfDragons)) {
      value = false;

      if (listOfDragons.length > 0)
        setError({ type: 1, message: errMsg.NOINSTANCES });
      else setError({ type: 1, message: errMsg.NODRAGONS });
    }

    setAutorefresh(value);
  }

  function handleUpdateDragon(index: number, val: number) {
    listOfDragons[index] = {
      ...listOfDragons[index],
      instances: val,
    };
    setAutorefresh(false);
    setListOfDragons([...listOfDragons]);
  }

  function handleRemove(index: number) {
    removeDragon(index);
  }

  function removeDragon(index: number) {
    const removed = listOfDragons.splice(index, 1);
    setListOfDragons([...listOfDragons]);
    checkingQueue.delete(removed[0].code);
  }

  function handleImageChange(code: string) {
    const handle = async () => {
      // console.log("NEW SIZE FOR "+code);
      // if SR isn't enabled, just stay as normal.
      if (!smartRemoval || checkingQueue.has(code)) {
        return;
      }

      try {
        checkingQueue.add(code);
        const { errors, data } = await DCAPI.checkDragon(code);

        // continue with SR checks
        if (errors.length > 0) {
          setError({ type: 1, message: errors.join(' ') });
        } else if (data.justHatched || !data.acceptable) {
          // console.log("SMART REMOVAL FOR "+code);
          // confirmed to be something we should remove.
          removeDragon(
            listOfDragons.findIndex((dragon) => dragon.code === code),
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          setError({
            type: 1,
            message: `${errMsg.BADCONNECTION} ${error.message}`,
          });
        }
      }
    };

    void handle();
  }

  function handleChangeIncludeInList(dragon: Dragon, value: boolean) {
    const newList = [...listOfDragons];
    const find = newList.find((v) => v.code === dragon.code);
    if (!find) {
      return;
    }
    find.enabled = value;
    setListOfDragons(newList);
  }

  function handleDismissGarden(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setShowGardenBanner(false);
  }

  return (
    <>
      {showGardenBanner && (
        <a
          href={`https://chazza.me/dc/hatchery`}
          className="bg-slate-500 px-8 py-4 rounded-md top-4 absolute self-center mx-4 text-center shadow-2xl"
        >
          Like FART? Why not bask in the smell of plants at the{' '}
          <span className="underline">Garden of Eden</span>?
          <button
            type="button"
            title="Click to dismiss"
            className="rounded-full p-3 absolute -right-2 -top-2 bg-slate-200 w-8 h-8 flex items-center justify-center text-slate-900"
            onClick={handleDismissGarden}
          >
            <FontAwesomeIcon icon={faX as IconProp} />
          </button>
        </a>
      )}
      <section id="add-dragon">
        <AddDragon
          rate={rate}
          addToList={handleAdd}
          top={<Heading>Add a dragon</Heading>}
          bottom={
            <ErrorDisplay
              className="my-2 text-center"
              error={error}
              done={() => setError(null)}
            />
          }
        />
      </section>
      <section id="controls">
        <Heading>Settings</Heading>
        <RefresherControls
          list={listOfDragons}
          rate={rate}
          smartRemoval={smartRemoval}
          autorefresh={autorefresh}
          updateRate={(rate: number) => {
            setAutorefresh(false);
            setRate(rate);
          }}
          click={() => {
            toggleAutorefresh(!autorefresh);
          }}
          updateSmartRemoval={(value: boolean) => {
            setSmartRemoval(value);
          }}
          noView={noView}
          updateNoView={(value: boolean) => {
            setNoView(value);
          }}
        />
      </section>
      <section className="space-y-3">
        <Heading>Dragons</Heading>
        {listOfDragons.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-4 items-stretch">
            {listOfDragons.map((dragon, index) => {
              return (
                <DragonTR
                  className={'flex flex-col text-center gap-1 relative'}
                  dragon={dragon}
                  key={dragon.code}
                  rate={rate}
                  setInstances={(instances: number) => {
                    handleUpdateDragon(index, instances);
                  }}
                  changeIncludeInList={handleChangeIncludeInList}
                  remove={() => {
                    handleRemove(index);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center">No dragons have been added.</p>
        )}
        {listOfDragons.find((dragon) => !dragon.enabled) && (
          <div className="bg-slate-800 text-stone-200 p-4 rounded-md text-center">
            <p className="text-center font-bold text-lg">
              Views on some dragons are disabled
            </p>
            <p>
              Views will be prevented from accumulating but dragons will still
              auto-refresh.
            </p>
          </div>
        )}
      </section>
      <section className="min-h-[5rem]">
        <Heading>Refresher</Heading>
        {autorefresh ? (
          <RefresherView
            dragonList={listOfDragons}
            rate={rate}
            onImageChange={handleImageChange}
            disableViews={noView}
          />
        ) : (
          <p className="text-center">FART hasn&apos;t been started.</p>
        )}
      </section>
    </>
  );
}
