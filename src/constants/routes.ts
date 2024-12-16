const baseUrl = import.meta.env.BASE_URL

const routes = [
  {
    title: "Home",
    url: baseUrl,
  },
  {
    title: "Mosaic",
    url: `${baseUrl}/mosaic`,
  },
  {
    title: "Racamn",
    url: `${baseUrl}/racaman`,
  },
]

export { routes }
