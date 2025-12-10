const csvUrl = "https://script.google.com/macros/s/AKfycby_2oSxv4gsS-z2_4Qk4d6q4nkdq81beNzkJvWhDBkXCL8vhYM8ElkooJAyhACsbdFa/exec";

const ROWS_PER_PAGE = 7;
const CUTOFF_DATE = new Date("2025-07-06");
let currentPage = 1;
let allData = [];
let avgKmPerDay = 0;

// Format date to YYYY-MM-DD format
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Calculate and update statistics based on data (only up to cutoff date)
function calculateAndUpdateStats(data) {
    // Sort by date (oldest first for calculation)
    const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a["Servicing Date"]);
        const dateB = new Date(b["Servicing Date"]);
        return dateA - dateB;
    });

    // Filter data up to cutoff date
    const validData = sorted.filter(item => {
        const itemDate = new Date(item["Servicing Date"]);
        return itemDate <= CUTOFF_DATE;
    });

    console.log("Valid records (up to cutoff):", validData.length);

    // Calculate average km per day and per week
    let totalKmAdded = 0;
    let totalDays = 0;

    for (let i = 0; i < validData.length - 1; i++) {
        const current = validData[i];
        const next = validData[i + 1];

        const distanceCurrent = parseInt(current["Distance Covered (Km)"]);
        const distanceNext = parseInt(next["Distance Covered (Km)"]);
        const diffKm = distanceNext - distanceCurrent;
        
        const dateCurrent = new Date(current["Servicing Date"]);
        const dateNext = new Date(next["Servicing Date"]);
        const diffDays = (dateNext - dateCurrent) / (1000 * 3600 * 24);

        if (diffKm > 0 && diffDays > 0) {
            totalKmAdded += diffKm;
            totalDays += diffDays;
        }
    }

    console.log("totaldays:", totalDays);
    console.log("totalkms:", totalKmAdded);

    avgKmPerDay = totalDays > 0 ? totalKmAdded / totalDays : 0;
    const avgKmMonth = avgKmPerDay * 30.44;
    const avgKmWeek = avgKmPerDay * 7;

    // Days since last service
    const lastService = new Date(sorted[sorted.length - 1]["Servicing Date"]);
    const today = new Date();
    const daysSince = Math.floor((today - lastService) / (1000 * 3600 * 24));

    // Update UI
    document.getElementById("avgMonth").innerText = Math.round(avgKmMonth) + " km";
    document.getElementById("avgWeek").innerText = Math.round(avgKmWeek) + " km";
    document.getElementById("avgDay").innerText = Math.round(avgKmPerDay) + " km";
    document.getElementById("daysLast").innerText = daysSince + " days";
}

// Fill missing km values for dates after cutoff date based on avg km per day
function fillProjectedKmValues(data) {
    const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a["Servicing Date"]);
        const dateB = new Date(b["Servicing Date"]);
        return dateA - dateB;
    });

    // Find the last valid entry (on or before cutoff date)
    let lastValidIndex = -1;
    let lastValidKm = 0;
    let lastValidDate = null;

    for (let i = 0; i < sorted.length; i++) {
        const itemDate = new Date(sorted[i]["Servicing Date"]);
        if (itemDate <= CUTOFF_DATE) {
            lastValidIndex = i;
            lastValidKm = parseInt(sorted[i]["Distance Covered (Km)"]);
            lastValidDate = itemDate;
        }
    }

    console.log("Last valid index:", lastValidIndex, "Last valid km:", lastValidKm);

    // Fill projected km for dates after cutoff
    if (lastValidIndex !== -1) {
        for (let i = lastValidIndex + 1; i < sorted.length; i++) {
            const itemDate = new Date(sorted[i]["Servicing Date"]);
            const daysDiff = (itemDate - lastValidDate) / (1000 * 3600 * 24);
            const projectedKm = lastValidKm + Math.round(daysDiff * avgKmPerDay);
            sorted[i]["Distance Covered (Km)"] = projectedKm;
        }
    }

    return sorted;
}

// Display table rows for current page
function displayPage(pageNum) {
    const tableBody = document.getElementById("serviceTableBody");
    tableBody.innerHTML = "";
    
    const startIndex = (pageNum - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const pageData = allData.slice(startIndex, endIndex);
    
    pageData.forEach(item => {
        const row = `
            <tr>
                <td>${formatDate(item["Servicing Date"])}</td>
                <td>${item["Service Center"]}</td>
                <td>₨${item["Cost"]}</td>
                <td>${item["Distance Covered (Km)"]} km</td>
                <td><span class="tag">${item["Engine Oil"]}</span></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    
    // Update pagination controls
    updatePaginationControls(pageNum);
}

// Update pagination buttons
function updatePaginationControls(currentPageNum) {
    const totalPages = Math.ceil(allData.length / ROWS_PER_PAGE);
    const paginationControls = document.getElementById("paginationControls");
    paginationControls.innerHTML = "";
    
    // Previous button
    const prevButton = document.createElement("li");
    prevButton.className = `page-item ${currentPageNum === 1 ? "disabled" : ""}`;
    prevButton.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPageNum - 1}); return false;">Previous</a>`;
    paginationControls.appendChild(prevButton);
    
    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("li");
        pageButton.className = `page-item ${i === currentPageNum ? "active" : ""}`;
        pageButton.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>`;
        paginationControls.appendChild(pageButton);
    }
    
    // Next button
    const nextButton = document.createElement("li");
    nextButton.className = `page-item ${currentPageNum === totalPages ? "disabled" : ""}`;
    nextButton.innerHTML = `<a class="page-link" href="#" onclick="goToPage(${currentPageNum + 1}); return false;">Next</a>`;
    paginationControls.appendChild(nextButton);
}

// Navigate to specific page
function goToPage(pageNum) {
    const totalPages = Math.ceil(allData.length / ROWS_PER_PAGE);
    if (pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        displayPage(pageNum);
        // Scroll to table
        document.querySelector(".table").scrollIntoView({ behavior: "smooth" });
    }
}

function loadTable(data) {
    // Calculate and update statistics (using only data up to cutoff date)
    calculateAndUpdateStats(data);
    
    // Fill projected km values for dates after cutoff date
    let dataWithProjections = fillProjectedKmValues(data);
    
    // Sort data by date (latest first, oldest last)
    const sortedData = dataWithProjections.sort((a, b) => {
        const dateA = new Date(a["Servicing Date"]);
        const dateB = new Date(b["Servicing Date"]);
        return dateB - dateA;
    });
    
    // Store all sorted data for pagination
    allData = sortedData;
    currentPage = 1;
    
    console.log("Total records:", data.length);
    
    // Display first page
    displayPage(1);
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
