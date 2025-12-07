const serviceData = [
    {
        date: "2025-01-12",
        center: "Shrestha Motors",
        cost: 4500,
        distance: "5,000 km",
        oil: "Fully Synthetic",
        km: 32000
    },
    {
        date: "2024-10-05",
        center: "AutoCare Nepal",
        cost: 3800,
        distance: "4,500 km",
        oil: "Semi Synthetic",
        km: 27000
    },
    {
        date: "2024-06-22",
        center: "Honda Service Center",
        cost: 5200,
        distance: "6,000 km",
        oil: "Fully Synthetic",
        km: 22500
    }
];

const tableBody = document.getElementById("serviceTableBody");

serviceData.forEach(item => {
    const row = `
        <tr>
            <td>${item.date}</td>
            <td>${item.center}</td>
            <td>${item.cost}</td>
            <td>${item.distance}</td>
            <td><span class="tag">${item.oil}</span></td>
            <td>${item.km}</td>
        </tr>
    `;
    tableBody.innerHTML += row;
});
