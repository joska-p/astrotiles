import { colorNames, getCssColors, getRandomPalette } from "#lib/colors.ts"
import { getRandom, shuffleObject } from "#lib/utils.ts"
import { useEffect, useRef, useState } from "react"
import Controls from "./Controls"

type MosaicProps = {
  tileWidth?: number
  tileHeight?: number
  initialTileSet: (({
    colors,
    rotation,
  }: {
    colors?: string[]
    rotation?: number
  }) => JSX.Element)[]
}

const Mosaic = ({ tileWidth = 100, tileHeight = 100, initialTileSet }: MosaicProps) => {
  const [tileSize, setTileSize] = useState({ width: tileWidth, height: tileHeight })
  const [tileSet, setTileSet] = useState(initialTileSet)
  const [palette, setPalette] = useState<string[]>([])
  const [cssColors, setCssColors] = useState<Record<string, string>>({})
  const [tiles, setTiles] = useState<JSX.Element[]>([])
  const mosaicRef = useRef<HTMLDivElement>(null)

  const styleObject = {
    ...cssColors,
    "--tile-width": `${tileSize.width}px`,
    "--tile-height": `${tileSize.height}px`,
    backgroundColor: "black",
  }

  const getNewPalette = async () => {
    const newPalette = await getRandomPalette()
    setPalette(newPalette)
  }

  const getNewTiles = () => {
    if (mosaicRef.current) {
      const numberOfTiles =
        Math.floor(mosaicRef.current.offsetWidth / tileSize.width) *
        Math.floor(mosaicRef.current.offsetHeight / tileSize.height)

      const newTiles = Array.from({ length: numberOfTiles }, (_, index) => {
        const Tile = getRandom(tileSet)

        return <Tile key={index} />
      })

      setTiles(newTiles)
    }
  }

  const shuffleCssColors = () => {
    setCssColors((prev) => shuffleObject(prev))
  }

  const handleResizeTiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = event.target.valueAsNumber
    setTileSize({ width: newSize, height: newSize })
  }

  const handleChangeTileSet = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checkbox = event.target
    const TileName = checkbox.value
    if (tileSet.length === 1 && tileSet[0].name === TileName) return
    if (tileSet.find((tile) => tile.name === TileName)) {
      setTileSet((prev) => prev.filter((tile) => tile.name !== TileName))
    } else {
      setTileSet((prev) => [...prev, ...initialTileSet.filter((tile) => tile.name === TileName)])
    }
  }

  useEffect(() => {
    setCssColors(getCssColors({ palette, colorNames }))
  }, [palette])

  useEffect(() => {
    getNewTiles()
  }, [tileSet])

  useEffect(() => {
    getNewPalette()
    getNewTiles()
  }, [])

  return (
    <div className="max-w-dvw grid h-dvh max-h-dvh w-dvw grid-rows-[auto_1fr] overflow-hidden">
      <Controls
        getNewPalette={getNewPalette}
        shuffleColors={shuffleCssColors}
        getNewTiles={getNewTiles}
        handleResizeTiles={handleResizeTiles}
        tileSize={tileSize}
        initialTileSet={initialTileSet}
        tileSet={tileSet}
        handleChangeTileSet={handleChangeTileSet}
      />
      <div
        style={styleObject}
        className="tiles mx-auto flex w-full flex-wrap content-center justify-center overflow-hidden"
        ref={mosaicRef}
      >
        {tiles}
      </div>
    </div>
  )
}

export default Mosaic
