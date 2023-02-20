import { useEffect, useState } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import ReactTooltip from 'react-tooltip';

import type { Dragon } from './app/interfaces';
import errMsg from './app/errors';
import * as DCAPI from './app/dcapi';
import { isCodeInList, validateCode } from './app/functions';
import useIconCycle from './hooks/useIconCycle';
import useParseListPreset from './hooks/useParseListPreset';
import Footer from './components/Footer';
import DragonTR from './components/DragonTR';
import AddDragon from './components/AddDragon';
import RefresherControls from './components/RefresherControls';
import RefresherView from './components/RefresherView';
import { ErrorDisplay } from './components/ErrorDisplay';
import type { ErrorMessage } from './components/ErrorDisplay';
import './App.css';

function hasRefreshableDragons(listOfDragons: Dragon[]) {
  return listOfDragons.findIndex((dragon) => dragon.instances > 0) > -1;
}

export default function App() {
  const [listOfDragons, setListOfDragons] = useSessionStorage<Dragon[]>(
    'listOfDragons',
    [],
  );
  const [rate, setRate] = useSessionStorage('rate', 250);
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
    <div className="flex flex-col min-h-screen">
      <ReactTooltip
        globalEventOff="click"
        place="top"
        effect="solid"
      />
      <main className="App rounded-lg shadow-lg bg-slate-900 max-w-md mx-auto text-white grow">
        <div className="max:pt-3">
          <section className="max:px-5">
            <AddDragon
              rate={rate}
              addToList={handleAdd}
            />
          </section>
          <section className="px-5 my-3">
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
            <ErrorDisplay
              error={error}
              done={setError}
            />
            <div className="grid grid-cols-2 gap-4 my-2 threecol:grid-cols-3">
              {listOfDragons.map((dragon, index) => {
                return (
                  <DragonTR
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
            <section className="px-5 my-3">
              <RefresherView
                dragonList={listOfDragons}
                rate={rate}
                onImageChange={handleImageChange}
                disableViews={noView}
              />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
