// Required DOM elements
const form = document.getElementById("checkInForm");
const form_attendeeName = document.getElementById("attendeeName");
const form_teamSelect = document.getElementById("teamSelect");

const disp_greeting = document.getElementById("greeting");
const disp_attendeeCount = document.getElementById("attendeeCount");
const disp_progressBar = document.getElementById("progressBar");

// Check-in data
const maxAttendees = 50;
const teams = [
  "water", // Team Water-Wise
  "zero", // Team Net-Zero
  "power" // Team Renewables
];

// Initialize check-in data object
const checkInData = {

  // Calculate the total number of attendees
  getTotalCount: function() {
    var total = 0;

    for(let team of teams) {
      total += this[team];
    }

    return total;
  },

  // Reset all check-in data and remove it from local storage (used for testing via JavaScript console)
  reset: function() {
    for(let team of teams) {
      this[team] = 0;
      localStorage.removeItem(team);
    }
  },

  // Read team attendee counts from local storage if it exists, or initialize it to 0
  load: function() {
    for(let team of teams)
    {
      checkInData[team] = parseInt(localStorage.getItem(team) ?? 0);
    }
  },

  // Increment the attendee count for a specific team
  incrementTeamCount: function (team) {
    this[team] ++;
    localStorage.setItem(team, this[team]);
  },
};

// Update the page to reflect the current check-in data
function updatePage(updatedTeam)
{
    // Update the HTML page to reflect new team count for specified team, or all teams if no team was specified
    if(updatedTeam !== undefined) {
      document.getElementById(updatedTeam + "Count").textContent = checkInData[updatedTeam];
    }
    else {
      for(let team of teams) {
        document.getElementById(team + "Count").textContent = checkInData[team];
      }
    }

    // Update the HTML page to reflect updated total attendee count
    disp_attendeeCount.textContent = checkInData.getTotalCount();
    disp_progressBar.textContent = checkInData.getTotalCount() / maxAttendees;
}

// Display personalized greeting for signed-in attendee
function displayGreeting(name, teamName)
{
  disp_greeting.textContent = `Welcome, ${name} from ${teamName}!`;
  disp_greeting.style.display = "block";
}

// Add event listener for form submission
form.addEventListener("submit", function (event) {
  // Override default form submission behavior
  event.preventDefault();

  // Retrieve entered form data
  const name = form_attendeeName.value;
  const team = form_teamSelect.value;
  const teamName = form_teamSelect.selectedOptions[0].text;

  // Update check-in stats
  checkInData.incrementTeamCount(team);
  updatePage(team);
  displayGreeting(name, teamName);

  console.log(`Attendee '${name}' signed in for team '${teamName}'.`);
});

// Add event listener for when page is finished loading
document.addEventListener("DOMContentLoaded", function() {
  // Initialize check-in data and update page
  checkInData.load();
  updatePage();
});
