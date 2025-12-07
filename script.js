const serviceData = [
    {
        date: "2025-01-12",
        center: "Shrestha Motors",
        cost: 4500,
        distance: 5000,
        oil: "Fully Synthetic",
        km: 32000
    },
    {
        date: "2024-10-05",
        center: "AutoCare Nepal",
        cost: 3800,
        distance: 4500,
        oil: "Semi Synthetic",
        km: 27000
    },
    {
        date: "2024-06-22",
        center: "Honda Service Center",
        cost: 5200,
        distance: 6000,
        oil: "Fully Synthetic",
        km: 22500
    },
    {
        date: "2024-03-15",
        center: "Bishal Auto Hub",
        cost: 4000,
        distance: 4800,
        oil: "Mineral",
        km: 16500
    },
    {
        date: "2023-12-01",
        center: "Honda Service Center",
        cost: 5000,
        distance: 5500,
        oil: "Fully Synthetic",
        km: 11700
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
            <td>${item.km}</td>
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

    const diffKm = newer.km - older.km;
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
