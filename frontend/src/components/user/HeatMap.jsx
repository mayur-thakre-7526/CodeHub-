import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";

// Function to generate random activity
const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);
    data.push({
      date: currentDate.toISOString().split("T")[0], //YYY-MM-DD (time ke basis bar split kiya and only date nikali usame me)
      count: count, // count of one day contribution 
    });
    currentDate.setDate(currentDate.getDate() + 1); // go to the next day or increase the current date by one to reach the end date in the while loop
  }

  return data;
};

// maxCount =  color shades ka count which is -> blank, light green, dark green 
const getPanelColors = (maxCount) => {
  const colors = {};
  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255); 
    colors[i] = `rgb(0, ${greenValue}, 0)`; // only setup the green value which produced randomly green color 
  }

  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const startDate = "2001-01-01";
      const endDate = "2001-01-31";
      const data = generateActivityData(startDate, endDate);
      setActivityData(data);

      const maxCount = Math.max(...data.map((d) => d.count)); // ak din me kitne contribution hai, take from data 
      setPanelColors(getPanelColors(maxCount));
    };

    fetchData();
  }, []);

  return (
    <div>
      <h4>Recent Contributions</h4>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "700px", height: "200px", color: "white" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={new Date("2001-01-01")}
        rectSize={15} //rectangle size
        space={3} // space b/w
        rectProps={{
          rx: 2.5, // horizontal size of the block 
        }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;
