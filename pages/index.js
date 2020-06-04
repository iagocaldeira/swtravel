import { useState } from "react";
import duration from 'dayjs/plugin/duration';
import dayjs from "dayjs";

export default function Home({ starships }) {
  const [distance, setDistance] = useState(1000000);

  const calculateTravelTime = MGLT => Math.ceil(Math.max(0, distance) / MGLT);
  const calculateTravelRessuplies = (consumables, travelTime) => Math.floor(travelTime / consumables);
  const calculateTravel = (starship) => {
    const travelTime = calculateTravelTime(starship.MGLT);
    const travelRessuplies = calculateTravelRessuplies(starship.consumables, travelTime);
    return { travelTime, travelRessuplies }
  }

  return (
    <div className="container">
      <main>
        <h1 className="title">
          Star Wars Travel Calculator
        </h1>
        <h2>
          This is a tool to calculate the minimum amount of ressuplies a starship could travel given the distance.
        </h2>
        <h3>MGLT <small>(Megalight)</small></h3>
        <p>
          The Maximum number of Megalights this starship can travel in a standard hour. A "Megalight" is a standard unit of distance and has never been defined before within the Star Wars universe. This figure is only really useful for measuring the difference in speed of starships. We can assume it is similar to AU, the distance between our Sun (Sol) and Earth.
        </p>
        <h3>Consumables</h3>
        <p>
          The maximum length of time that this starship can provide consumables for its entire crew without having to resupply.
        </p>

        <span>Travel Distance</span>
        <input value={distance} type="number" min="0"
          onChange={e => setDistance(e.target.value)} />
        <ul>
          {starships?.map((starship) => (
            <li key={starship.id}>
              Name: <strong>{starship.name}</strong>
              <br />
              Maximum MGLT per hour: {starship.MGLT}
              <br />
              Maximum Consumables time length: {starship.consumables}
              <br />
              Travel Time: {calculateTravelTime(starship.MGLT)} Hours
              <br />
              Ressuplies: {
                  calculateTravelRessuplies(starship.consumables, calculateTravelTime(starship.MGLT))
              }
              <br />
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  dayjs.extend(duration);
  const pages = Array(4).fill().map((_, i) => fetch(`https://swapi.dev/api/starships/?page=${i + 1}`));
  const pageFetchList = await Promise.all(pages);
  const results = (await Promise.all(pageFetchList.map(x => x.json())))
    .reduce((acc, cur) => acc.concat(cur.results), [])
    .filter(x => /^\d+$/.test(x.MGLT))
    .map(x => ({
      ...x,
      id: /\d+/.exec(x.url)[0],
      consumables: dayjs.duration(...x.consumables.split(' ')).asHours()
    }))
  return {
    props: {
      starships: results,
    },
  }
}