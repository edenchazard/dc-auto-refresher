import React, { useEffect, useState } from 'react';
import { useLocalStorage, useSessionStorage } from 'usehooks-ts';
import ReactTooltip from 'react-tooltip';

import type { Dragon } from './app/interfaces';
import errMsg from './app/errors';
import * as DCAPI from './app/dcapi';
import {
  hasRefreshableDragons,
  isCodeInList,
  validateCode,
} from './app/functions';
import useIconCycle from './hooks/useIconCycle';
import useParseListPreset from './hooks/useParseListPreset';
import Header from './components/Header';
import DragonTR from './components/DragonTR';
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import RefresherView from './components/RefresherView';
import { ErrorDisplay } from './components/ErrorDisplay';
import type { ErrorMessage } from './components/ErrorDisplay';
import './App.css';

function Heading({ children }: { children: React.ReactNode }) {
  return (
    //<div className="relative flex items-center gap-5">
    //  <div className="flex-grow border-t border-gray-400"></div>
    <h2 className="text-center">{children}</h2>
    //   <div className="flex-grow border-t border-gray-400"></div>
    // </div>
  );
}

export default function App() {
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

  // handle icon changes when auto refresh is active
  useIconCycle(autorefresh, listOfDragons, 'FART', './logo192.png');

  // Was a preset list param specified?
  useParseListPreset(setListOfDragons, true);

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
            { code: dragon.code, instances: dragon.instances, tod: data.tod },
          ];

          // https://stackoverflow.com/a/58748962
          orderedList.sort(
            ({ tod: a }, { tod: b }) =>
              (a !== null ? a : Infinity) - (b !== null ? b : Infinity),
          );

          setListOfDragons(orderedList);
          setError(null);
          setAutorefresh(false);

          // fixes problem that stops the tooltip for TOD appearing
          ReactTooltip.rebuild();
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
    listOfDragons.splice(index, 1);
    setListOfDragons([...listOfDragons]);
  }

  function handleImageChange(code: string) {
    const handle = async () => {
      // console.log("NEW SIZE FOR "+code);
      // if SR isn't enabled, just stay as normal.
      if (!smartRemoval) {
        return;
      }

      try {
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

  return (
    <div className="min-h-screen font-sans font-normal font-base">
      <ReactTooltip
        globalEventOff="click"
        place="top"
        effect="solid"
      />
      <div className="min-h-screen App rounded-lg shadow-lg bg-slate-900 max-w-md mx-auto text-white">
        <Header />
        <main className="p-0 flex flex-col gap-3 [&>section:not(#add-dragon)]:m-2 max:p-3">
          <section id="add-dragon">
            <AddDragon
              rate={rate}
              addToList={handleAdd}
              top={<Heading>Add a dragon</Heading>}
              bottom={
                <ErrorDisplay
                  className="my-2 text-center"
                  error={error}
                  done={setError}
                />
              }
            />
          </section>
          <section
            id="controls"
            className=""
          >
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
          <section>
            <Heading>Dragons</Heading>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-4 items-stretch">
              {listOfDragons.map((dragon, index) => {
                return (
                  <DragonTR
                    className={'flex flex-col text-center gap-1'}
                    dragon={dragon}
                    key={dragon.code}
                    rate={rate}
                    setInstances={(instances: number) => {
                      handleUpdateDragon(index, instances);
                    }}
                    remove={() => {
                      handleRemove(index);
                    }}
                  />
                );
              })}
            </div>
          </section>
          {autorefresh && (
            <section>
              <Heading>Refresher</Heading>
              <RefresherView
                dragonList={listOfDragons}
                rate={rate}
                onImageChange={handleImageChange}
                disableViews={noView}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
