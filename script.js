// URL החדש של ה-Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbzX3Dutpgk0XKAjZqpJmvYPgoaAXRH3gwHBJl5g7YViQh0Uq0jsks3gKSUKyf137Tc/exec";

// פונקציה למשיכת הקמפיינים מהשרת
async function fetchCampaigns() {
  try {
    const response = await fetch(`${API_URL}?type=getCampaigns`);
    const campaigns = await response.json();

    if (Array.isArray(campaigns)) {
      console.log("Fetched campaigns:", campaigns);
      renderCampaigns(campaigns);
      updateSummary(campaigns);
    } else {
      console.error("Expected an array of campaigns, received:", campaigns);
    }
  } catch (error) {
    console.error("Error fetching campaigns:", error);
  }
}

// פונקציה להצגת הקמפיינים בטבלה
function renderCampaigns(campaigns) {
  const campaignsBody = document.getElementById('campaigns-body');
  campaignsBody.innerHTML = '';

  campaigns.forEach(campaign => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${campaign.name}</td>
      <td>${campaign.leader}</td>
      <td>₪${campaign.goal.toLocaleString()}</td>
      <td>₪${campaign.raised.toLocaleString()}</td>
      <td>${campaign.donors}</td>
      <td>${campaign.status}</td>
    `;

    campaignsBody.appendChild(row);
  });
}

// פונקציה לעדכון הכרטיסים העליונים
function updateSummary(campaigns) {
  const totalRaised = campaigns.reduce((sum, campaign) => sum + (parseFloat(campaign.raised) || 0), 0);
  const totalDonors = campaigns.reduce((sum, campaign) => sum + (parseInt(campaign.donors) || 0), 0);
  const activeCampaigns = campaigns.filter(campaign => campaign.status === "פעיל").length;

  document.getElementById('total-raised').textContent = `₪${totalRaised.toLocaleString()}`;
  document.getElementById('total-donors').textContent = totalDonors;
  document.getElementById('active-campaigns').textContent = activeCampaigns;
}

// קריאה ראשונית של הקמפיינים עם פתיחת הדף
document.addEventListener("DOMContentLoaded", fetchCampaigns);