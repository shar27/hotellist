import { useEffect, useState } from "react";

export default function App() {
  const [hotelRooms, setHotelRooms] = useState([]);
  const [filter, setFilter] = useState({ ratings: ["1", "2", "3", "4", "5"] });
  const [extra, setExtra] = useState({ occupancy: ["1", "2", "3", "4", "5"] });
    const [kids, setKids] = useState({ stay: ["1","2", "3", "4", "5"] });
    const [overall, setOverall] = useState({ total: ["1","2", "3", "4", "5"] });
  const fetchHotels = async () => {
    const res = await fetch(
      "https://obmng.dbm.guestline.net/api/hotels?collection-id=OBMNG"
    );
    const hotels = await res.json();

    const hotelRooms = [];

    for (const hotel of hotels) {
      const res = await fetch(
        `https://obmng.dbm.guestline.net/api/roomRates/OBMNG/${hotel.id}`
      );
      const info = await res.json();
      hotelRooms.push({ hotel, rooms: info.rooms });
    }

    setHotelRooms(hotelRooms);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleRatingFilter = (e) => {
    if (e.target.checked) {
      // adding value
      const temp = [...filter.ratings];
      temp.push(e.target.value);
      setFilter({ ...filter, ratings: temp });
    } else {
      // removing value
      setFilter({
        ...filter,
        ratings: [...filter.ratings.filter((v) => v !== e.target.value)]
      });
    }
  };

  const handleGuestsOverall = (e) => {
    if (e.target.checked) {
      // adding value
      const people = [...overall.total];
      people.push(e.target.value);
      setOverall({ ...overall, total: people });
    } else {
      // removing value
      setOverall({
        ...overall,
        total: [...overall.total.filter((i) => i !== e.target.value)]
      });
    }
  };

  const handleOccupancyExtra = (e) => {
    if (e.target.checked) {
      const perm = [...extra.occupancy];
      perm.push(e.target.value);
      setExtra({ ...extra, occupancy: perm });
    } else {
      setExtra({
        ...extra,
        occupancy: [...extra.occupancy.filter((d) => d !== e.target.value)]
      });
    }
  };

  const handleKidsStay = (e) => {
    if (e.target.checked) {
      const children = [...kids.stay];
      children.push(e.target.value);
      setKids({ ...kids, stay: children });
    } else {
      setKids({
        ...kids,
        stay: [...kids.stay.filter((g) => g !== e.target.value)]
      });
    }
  };


  console.log(hotelRooms);
  console.log(extra);
  console.log(kids)
  console.log(overall)

  return (
    <div className="App">
      <div>
        {["1", "2", "3", "4", "5"].map((star) => (
          <div key={"input-" + star}>
            <input
              id={"rated" + star}
              value={star}
              name="ratings"
              type="checkbox"
              checked={filter.ratings.includes(star)}
              onChange={handleRatingFilter}
            />
            <label htmlFor={"rated" + star}>Rated {star} star</label>
          </div>
        ))}
      </div>
      <div>
        {["1", "2", "3", "4", "5"].map((adults) => (
          <div key={"adults" + adults}>
            <input
              id={"maximum" + adults}
              value={adults}
              name="extra"
              type="checkbox"
              checked={extra.occupancy.includes(adults)}
              onChange={handleOccupancyExtra}
            />
            <label htmlFor={"maximum" + adults}>Adults {adults}</label>
          </div>
        ))}
      </div>

      <div>
        {["1", "2", "3", "4", "5"].map((kiddies) => (
          <div key={"kids" + kiddies}>
            <input
              id={"kids" + kiddies}
              value={kiddies}
              name="kids"
              type="checkbox"
              checked={kids.stay.includes(kiddies)}
              onChange={handleKidsStay}
            />
            <label htmlFor={"kids" + kiddies}>kiddies {kiddies}</label>
          </div>
        ))}
      </div>

      <div>
        {["1", "2", "3", "4", "5"].map((people) => (
          <div key={"ppl" + people}>
            <input
              id={"people" + people}
              value={people}
              name="people"
              type="checkbox"
              checked={overall.total.includes(people)}
              onChange={handleGuestsOverall}
            />
            <label htmlFor={"people" + people}>people {people}</label>
          </div>
        ))}
      </div>

      {hotelRooms
        .filter(
          (h) =>
            filter.ratings.includes(h.hotel.starRating) &&
            h.rooms.some((room) =>
              extra.occupancy.includes(room.occupancy.maxAdults + room.occupancy.maxChildren + "")
            )
        )
        .map((h, idx) => (
          <div key={idx}>
            <h2> Name: {h.hotel.name}</h2>
            <p> Description: {h.hotel.description}</p>
            <p> Rating: {h.hotel.starRating}</p>
            <p> Postcode: {h.hotel.postcode}</p>
            <p> City: {h.hotel.town}</p>

            <p style={{ fontWeight: "bold" }}>Rooms:</p>

            {h.rooms.filter((room) => (
  extra.occupancy.includes(room.occupancy.maxAdults.toString())&& 
  kids.stay.includes(room.occupancy.maxChildren.toString()) && 
  overall.total.includes(room.occupancy.maxOverall.toString())
))
            
  
              .map((room, idx) => (
                <div key={idx}>
                  <h5>Occupancy</h5>

                  <div> Adults: {room.occupancy.maxAdults}</div>
                  <div> Children: {room.occupancy.maxChildren}</div>
                  <div> Maximum guests: {room.occupancy.maxOverall}</div>
                  <div> Room type: {room.name}</div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
}
