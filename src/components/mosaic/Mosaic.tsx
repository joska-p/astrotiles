import {
  getColorProperties,
  getRandomColorsToUse,
  getRandomPalette,
} from "@/components/mosaic/lib/colors";
import { useDebounce } from "@/hooks/use-debounce";
import { getRandom, shuffleObject } from "@lib/utils";
import { Sidebar, SidebarProvider } from "@ui/sidebar";
import { useEffect, useMemo, useRef, useState } from "react";
import Controls from "./controls/Controls";
import Tile from "./tiles/Tile";
import { defaultTileSet } from "./tiles/default-tile-set";

export type DefaultTileSet = typeof defaultTileSet;

const Mosaic = ({ tileWidth = 64, tileHeight = 64, initialTileSet = defaultTileSet }) => {
  const [mosaicTileSize, setMosaicTileSize] = useState({ width: tileWidth, height: tileHeight });
  const [mosaicTileSet, setMosaicTileSet] = useState(initialTileSet);
  const [colorProperties, setColorProperties] = useState(getColorProperties());
  const [mosaicTiles, setMosaicTiles] = useState<DefaultTileSet>([]);
  const [mosaicGap, setMosaicGap] = useState(0);
  const [mosaicSize, setMosaicSize] = useState({ width: 0, height: 0 });
  const mosaicRef = useRef<HTMLDivElement>(null);

  const styleObject = useMemo(
    () =>
      ({
        ...colorProperties,
        "--tile-width": `${mosaicTileSize.width}px`,
        "--tile-height": `${mosaicTileSize.height}px`,
        "--gap": `${mosaicGap}px`,
      }) as React.CSSProperties,
    [colorProperties, mosaicGap, mosaicTileSize]
  );

  const setNewColors = async () => {
    const newPalette = await getRandomPalette();
    const newColorProperties = getColorProperties(newPalette);
    setColorProperties(newColorProperties);
  };

  const swapColors = () => {
    const newColorProperties = shuffleObject(colorProperties);
    Object.entries(newColorProperties).forEach(([key, value]) => {
      mosaicRef.current?.style.setProperty(key, value);
    });
  };

  const setNewTiles = () => {
    if (!mosaicRef.current) return;

    const newNumberOfTiles =
      Math.floor(mosaicSize.width / mosaicTileSize.width) *
      Math.floor(mosaicSize.height / mosaicTileSize.height);

    const newTiles = Array.from({ length: newNumberOfTiles }, () => {
      const newTileName = getRandom(mosaicTileSet).name;
      return {
        name: newTileName,
        colorNames: getRandomColorsToUse(),
        rotation: getRandom([0, 90, 180, 270]),
      };
    });
    setMosaicTiles(newTiles);
  };

  const handleChangeMosaicTileSet = (tileName: string) => {
    if (mosaicTileSet.length === 1 && tileName === mosaicTileSet[0].name) return;

    if (mosaicTileSet.find((tile) => tile.name === tileName)) {
      setMosaicTileSet((prev) => prev.filter((tile) => tile.name !== tileName));
    } else {
      const newTile = initialTileSet.filter((tile) => tile.name === tileName);
      setMosaicTileSet((prev) => [...prev, ...newTile]);
    }
  };

  useEffect(setNewTiles, [mosaicTileSet, mosaicTileSize, mosaicGap]);

  useDebounce(
    () => {
      setNewTiles();
    },
    200,
    [mosaicSize]
  );

  useEffect(() => {
    if (!mosaicRef.current) return;

    const observer = new ResizeObserver(() => {
      setMosaicSize({
        width: mosaicRef.current!.offsetWidth,
        height: mosaicRef.current!.offsetHeight,
      });
    });
    observer.observe(mosaicRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <SidebarProvider className="flex-grow">
      <div
        ref={mosaicRef}
        className="relative flex h-full w-full flex-wrap place-content-center gap-[var(--gap)] overflow-hidden"
        style={styleObject}
      >
        {mosaicTiles.map((tile, index) => (
          <Tile key={index} name={tile.name} />
        ))}
      </div>

      <Sidebar position="right">
        <Controls
          mosaicTileSet={mosaicTileSet}
          handleChangeMosaicTileSet={handleChangeMosaicTileSet}
          mosaicGap={mosaicGap}
          handleChangeMosaicGap={setMosaicGap}
          mosaicTileSize={mosaicTileSize}
          handleResizeMosaicTiles={setMosaicTileSize}
          initialTileSet={initialTileSet}
          setNewColors={setNewColors}
          swapColors={swapColors}
          setNewTiles={setNewTiles}
        />
      </Sidebar>
    </SidebarProvider>
  );
};

export default Mosaic;
