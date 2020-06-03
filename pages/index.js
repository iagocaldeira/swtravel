export default function Home({ starships }) {
  return (
    <div className="container">
      <main>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <ul>
          {starships?.map((starship) => (
            <li key={starship.id}>
              name: {starship.name}
              <br />
              MGLT: {starship.MGLT}
              <br />
              calculateStops: {calculateStops(starship.MGLT, 60)}
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const pages = Array(4).fill().map((_, i) => fetch(`https://swapi.dev/api/starships/?page=${i + 1}`));
  const pageFetchList = await Promise.all(pages);
  const results = (await Promise.all(pageFetchList.map(x => x.json())))
    .reduce((acc, cur) => acc.concat(cur.results), [])
    .filter(x => /^\d+$/.test(x.MGLT))
    .map(x => ({ ...x, id: /\d+/.exec(x.url)[0] }))
  return {
    props: {
      starships: results,
    },
  }
}

const calculateStops = (MGLT, distance) => Math.ceil(distance / MGLT);