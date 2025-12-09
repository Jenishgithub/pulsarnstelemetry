const csvUrl = "https://script.google.com/macros/s/AKfycby_2oSxv4gsS-z2_4Qk4d6q4nkdq81beNzkJvWhDBkXCL8vhYM8ElkooJAyhACsbdFa/exec";

const ROWS_PER_PAGE = 7;
let currentPage = 1;
let allData = [];

// Format date to YYYY-MM-DD format
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

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
    // Sort data by date (latest first, oldest last)
    const sortedData = [...data].sort((a, b) => {
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
    
    // Calculate and update statistics after loading table
    calculateAndUpdateStats(sortedData);
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
