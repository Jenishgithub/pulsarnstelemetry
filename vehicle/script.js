const csvUrl = "https://script.google.com/macros/s/AKfycby_2oSxv4gsS-z2_4Qk4d6q4nkdq81beNzkJvWhDBkXCL8vhYM8ElkooJAyhACsbdFa/exec";

// Calculate and update statistics based on data
function calculateAndUpdateStats(data) {
    // Sort by date (newest first)
    const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a["Servicing Date"]);
        const dateB = new Date(b["Servicing Date"]);
        return dateB - dateA;
    });

    console.log("sorted:", sorted[0]);

    // Calculate average km per month & week
    let totalKmAdded = 0;
    let totalDays = 0;

    for (let i = 0; i < sorted.length - 1; i++) {
        const newer = sorted[i];
        const older = sorted[i + 1];

        const distanceNew = parseInt(newer["Distance Covered (Km)"]);
        const distanceOld = parseInt(older["Distance Covered (Km)"]);
        const diffKm = distanceNew - distanceOld;
        
        const dateNew = new Date(newer["Servicing Date"]);
        const dateOld = new Date(older["Servicing Date"]);
        const diffDays = (dateNew - dateOld) / (1000 * 3600 * 24);

        if (diffKm > 0 && diffDays > 0) {
            totalKmAdded += diffKm;
            totalDays += diffDays;
        }
    }

    console.log("totaldays:", totalDays);
    console.log("totalkms:", totalKmAdded);

    const avgKmPerDay = totalKmAdded / totalDays;
    const avgKmMonth = avgKmPerDay * 30.44;
    const avgKmWeek = avgKmPerDay * 7;

    // Days since last service
    const lastService = new Date(sorted[0]["Servicing Date"]);
    const today = new Date();
    const daysSince = Math.floor((today - lastService) / (1000 * 3600 * 24));

    // Update UI
    document.getElementById("avgMonth").innerText = Math.round(avgKmMonth) + " km";
    document.getElementById("avgWeek").innerText = Math.round(avgKmWeek) + " km";
    document.getElementById("daysLast").innerText = daysSince + " days";
}

function loadTable(data) {
    const tableBody = document.getElementById("serviceTableBody");
    tableBody.innerHTML = "";

    data.forEach(item => {
        console.log(item);
        
        const row = `
            <tr>
                <td>${item["Servicing Date"]}</td>
                <td>${item["Service Center"]}</td>
                <td>₨${item["Cost"]}</td>
                <td>${item["Distance Covered (Km)"]} km</td>
                <td><span class="tag">${item["Engine Oil"]}</span></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    // Calculate and update statistics after loading table
    calculateAndUpdateStats(data);
}

// Use the fetch() function to make a GET request
fetch(csvUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Fetched data:', data);
    loadTable(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
/* ========== BACK TO TOP ========== */
$(document).ready(function() {
    // Back to top
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $(".back-to-top").fadeIn("slow");
        } else {
            $(".back-to-top").fadeOut("slow");
        }
    });
    
    $(".back-to-top").click(function(e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });
});
