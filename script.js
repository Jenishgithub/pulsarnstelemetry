const serviceData = [
    {
        date: "2021-09-13",
        center: "Bikers Depot",
        cost: 2320,
        distance: 8285,
        oil: "Petronas sprinta f700"
    },
     {
        date: "2022-02-15",
        center: "Bikers Depot",
        cost: 2500,
        distance: 10115,
        oil: "Petronas sprinta f700"
    },
     {
        date: "2022-08-18",
        center: "Bikers Depot",
        cost: 4500,
        distance: 12178,
        oil: "Petronas sprinta f700"
    },
     {
        date: "2023-02-03",
        center: "Bikers Depot",
        cost: 3000,
        distance: 14770,
        oil: "Petronas sprinta f700"
    },
     {
        date: "2023-08-16",
        center: "Bikers Depot",
        cost: 3500,
        distance: 17280,
        oil: "Petronas sprinta f700"
    },
     {
        date: "2024-02-25",
        center: "Bikers Depot",
        cost: 4850,
        distance: 20073,
        oil: "Petronas sprinta f700"
    },
    {
        date: "2024-08-13",
        center: "Bikers Depot",
        cost: 4600,
        distance: 23184,
        oil: "Petronas sprinta f700"
    },
    {
        date: "2025-01-21",
        center: "Bikers Depot",
        cost: 6250,
        distance: 25290,
        oil: "Petronas sprinta f700"
    },
    {
        date: "2024-07-06",
        center: "Bikers Depot",
        cost: 4150,
        distance: 27090,
        oil: "Petronas sprinta f700"
    }
    
];

const tableBody = document.getElementById("serviceTableBody");

serviceData.forEach(item => {
    const row = `
        <tr>
            <td>${item.date}</td>
            <td>${item.center}</td>
            <td>${item.cost}</td>
            <td>${item.distance} km</td>
            <td><span class="tag">${item.oil}</span></td>
        </tr>
    `;
    tableBody.innerHTML += row;
});

/* ========== CALCULATE STATS ========== */

// Sort by date (newest first)
const sorted = [...serviceData].sort((a, b) => new Date(b.date) - new Date(a.date));

console.log("sorted" + sorted[0].date)

// Calculate average km per month & week
let totalKmAdded = 0;
let totalDays = 0;

for (let i = 0; i < sorted.length - 1; i++) {
    const newer = sorted[i];
    const older = sorted[i + 1];

    const diffKm = newer.distance - older.distance;
    const diffDays = (new Date(newer.date) - new Date(older.date)) / (1000 * 3600 * 24);

    if (diffKm > 0 && diffDays > 0) {
        totalKmAdded += diffKm;
        totalDays += diffDays;
    }
}

console.log("diffdays" + totalDays)

const avgKmPerDay = totalKmAdded / totalDays;
const avgKmMonth = avgKmPerDay * 30.44;
const avgKmWeek = avgKmPerDay * 7;

// Days since last service
const lastService = new Date(sorted[0].date);
const today = new Date();
const daysSince = Math.floor((today - lastService) / (1000 * 3600 * 24));

// Update UI
document.getElementById("avgMonth").innerText = Math.round(avgKmMonth) + " km";
document.getElementById("avgWeek").innerText = Math.round(avgKmWeek) + " km";
document.getElementById("daysLast").innerText = daysSince + " days";
