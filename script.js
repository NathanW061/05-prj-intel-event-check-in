// Required DOM elements
const form = document.getElementById("checkInForm");
const form_attendeeName = document.getElementById("attendeeName");
const form_teamSelect = document.getElementById("teamSelect");
const form_submitBtn = document.getElementById("checkInBtn");

const disp_winner = document.getElementById("congrats");
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
    let total = 0;

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
      this[team] = [];
      localStorage.removeItem(team);
    }
  },

  // Read team attendee counts from local storage if it exists, or initialize it to 0
  load: function() {
    for(let team of teams)
    {
      this[team] = [];

      const teamListJson = localStorage.getItem(team);
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

// Get the formal name of a team
function getTeamName(team)
{
  return document.getElementById(team + "Name").textContent;
}

// Update team-specific page elements
function updatePageTeam(updatedTeam)
{
  // Update the displayed count
  document.getElementById(updatedTeam + "Count").textContent = checkInData.getTeamCount(updatedTeam);

  // Iterate through attendee list elements and append new attendee items if needed
  const attendeeList = document.getElementById(updatedTeam + "Names");
  const expectedAttendees = checkInData.getTeamAttendees(updatedTeam);
  for(let i = 0; i < expectedAttendees.length; i ++)
  {
    const expectedName = expectedAttendees[i];
    if(i >= attendeeList.children.length)
    {
      // Append the name to the team's list
      const listItem = document.createElement("li");
      listItem.textContent = expectedName;
      attendeeList.appendChild(listItem);
    }
    else
    {
      // Update attendee name if it doesn't match
      const currentNameNode = attendeeList.children[i];
      if(currentNameNode.textContent !== expectedName)
        currentNameNode.textContent = expectedName;
    }
  }

  // Remove attendees that aren't supposed to be there
  while(attendeeList.children.length > expectedAttendees.length)
    attendeeList.removeChild(attendeeList.lastChild);
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

  // Stop accepting attendees and display winner message if max attendees are present
  const attendeeMaxReached = checkInData.getTotalCount() >= maxAttendees;
  form_submitBtn.disabled = attendeeMaxReached;
  
  // Generate a congratulations message for the winning team(s) if the max attendees are present
  if(attendeeMaxReached)
  {
    disp_winner.style.display = "block";
    
    // Determine which one or two teams had the most attendees
    let winners = [];
    let maxCount = 0;
    for(let team of teams)
    {
      const teamCount = checkInData.getTeamCount(team);
      if(teamCount > maxCount)
      {
        maxCount = teamCount;
        winners = [];
      }
      
      if(teamCount >= maxCount)
        winners.push(team);
    }

    // Display the message depending on if one or two teams won
    if(winners.length === 1)
    {
      disp_winner.textContent = `🎊 All attendees checked in! The winning team is ${getTeamName(winners[0])}.`;
    }
    else
    {
      disp_winner.textContent = `🎊 All attendees checked in! The winning teams are ${getTeamName(winners[0])} and ${getTeamName(winners[1])}.`;
    }
  }
  else
    disp_winner.style.display = "none";
}

// Display personalized greeting for signed-in attendee
function displayGreeting(name, teamName)
{
  disp_greeting.textContent = `👋 Welcome, ${name} from ${teamName}!`;
  disp_greeting.style.display = "block";
}

// Adds an entered name to a team's list of attendees
function addNameToTeam(name, team)
{
  // Add the name to the check-in data
  checkInData.addToTeam(team, name);

  // Append the name to the team's list
  const listItem = document.createElement("li");
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

// Debug function for testing
function debug_resetState()
{
  checkInData.reset();
  updatePage();

  disp_greeting.style.display = "none";
  document.getElementById("checkInBtn").disabled = false;

  console.log("Reset check-in data and page state.");
}