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
      total += this[team].length;
    }

    return total;
  },

  // Get the list of attendees for a specific team
  getTeamAttendees: function(team) {
    return this[team];
  },

  // Calculate the number of attendees for a specific team
  getTeamCount: function(team)
  {
    return this[team].length;
  },

  // Reset all check-in data and remove it from local storage (used for testing via JavaScript console)
  reset: function() {
    for(let team of teams) {
      //this[team] = 0;
      this[team] = [];
      localStorage.removeItem(team);
    }
  },

  // Read team attendee counts from local storage if it exists, or initialize it to 0
  load: function() {
    for(let team of teams)
    {
      this[team] = [];

      let teamListJson = localStorage.getItem(team);
      if(teamListJson !== null)
        this[team] = JSON.parse(teamListJson);
    }
  },

  // Adds an attendee to a specific team
  addToTeam: function(team, name) {
    this[team].push(name);
    localStorage.setItem(team, JSON.stringify(this[team]));
  }
};

// Update team-specific page elements
function updatePageTeam(updatedTeam)
{
  // Update the displayed count
  document.getElementById(updatedTeam + "Count").textContent = checkInData.getTeamCount(updatedTeam);

  // Iterate through attendee list elements and append new attendee items if needed
  let attendeeList = document.getElementById(updatedTeam + "Names");
  let expectedAttendees = checkInData.getTeamAttendees(updatedTeam);
  for(var i = 0; i < expectedAttendees.length; i ++)
  {
    let expectedName = expectedAttendees[i];
    if(i >= attendeeList.children.length)
    {
      // Append the name to the team's list
      var listItem = document.createElement("li");
      listItem.textContent = expectedName;
      attendeeList.appendChild(listItem);
    }
    else
    {
      // Update attendee name if it doesn't match
      let currentNameNode = attendeeList.children[i];
      if(currentNameNode.textContent !== expectedName)
        currentNameNode.textContent = expectedName;
    }
  }
}

// Update the page to reflect the current check-in data
function updatePage(updatedTeam)
{
    // Update the HTML page to reflect new team count for specified team, or all teams if no team was specified
    if(updatedTeam !== undefined) {
      updatePageTeam(updatedTeam);
    }
    else {
      for(let team of teams) {
        updatePageTeam(team);
      }
    }

    // Update the HTML page to reflect updated total attendee count
    disp_attendeeCount.textContent = checkInData.getTotalCount();
    disp_progressBar.style.width = (checkInData.getTotalCount() / maxAttendees * 100) + "%";
}

// Display personalized greeting for signed-in attendee
function displayGreeting(name, teamName)
{
  disp_greeting.textContent = `Welcome, ${name} from ${teamName}!`;
  disp_greeting.style.display = "block";
}

// Adds an entered name to a team's list of attendees
function addNameToTeam(name, team)
{
  // Add the name to the check-in data
  checkInData.addToTeam(team, name);

  // Append the name to the team's list
  var listItem = document.createElement("li");
  listItem.textContent = name;
  document.getElementById(team + "Names").appendChild(listItem);
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
  addNameToTeam(name, team);
  displayGreeting(name, teamName);
  updatePage(team);

  console.log(`Attendee '${name}' signed in for team '${teamName}'.`);
});

// Add event listener for when page is finished loading
document.addEventListener("DOMContentLoaded", function() {
  // Initialize check-in data and update page
  checkInData.load();
  updatePage();
});
