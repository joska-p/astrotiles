import { getRandom } from "./utils"

const colorNames = ["--color-0", "--color-1", "--color-2", "--color-3", "--color-4"]

const getRandomPalette = async () => {
  let palette: [string, string, string, string, string]

  // check for local storage
  if (localStorage.getItem("palettes")) {
    const palettes = JSON.parse(localStorage.getItem("palettes") || "[]")
    palette = getRandom(palettes)
  } else {
    // if not, fetch and store
    const palettes = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/1000.json").then(
      (response) => response.json()
    )

    localStorage.setItem("palettes", JSON.stringify(palettes))
    palette = getRandom(palettes)
  }

  return palette
}

const getCssColors = ({ palette, colorNames }: { palette: string[]; colorNames: string[] }) => {
  return colorNames.reduce((acc: Record<string, string>, color, index) => {
    acc[color] = palette[index]
    return acc
  }, {})
}

const getColorsToUse = () => colorNames.map(() => getRandom(colorNames))

export { colorNames, getColorsToUse, getCssColors, getRandomPalette }
