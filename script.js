const searchInput = document.getElementById('searchInput');
const profileContainer = document.getElementById('profileContainer');

searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const username = searchInput.value.trim();
    if (username) {
      getUserData(username);
    }
  }
});

function getUserData(username) {
  fetch(`https://api.github.com/users/${username}`)
    .then(response => {
      if (!response.ok) throw new Error("User not found");
      return response.json();
    })
    .then(user => {
      displayUserProfile(user);
      return fetch(user.repos_url); // Fetch repos next
    })
    .then(res => res.json())
    .then(repos => {
      displayUserRepos(repos);
    })
    .catch(error => {
      profileContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });
}

function displayUserProfile(user) {
  profileContainer.innerHTML = `
    <img src="${user.avatar_url}" alt="${user.name}'s profile picture">
    <h2>${user.name}</h2>
    <p>${user.bio || "No bio available"}</p>
    <p>${user.followers} <strong>Followers</strong> • ${user.following} <strong>Following</strong> • ${user.public_repos} <strong>Repos</strong></p>
    <div id="repoList"></div>
  `;
}

function displayUserRepos(repos) {
  const repoList = document.getElementById('repoList');
  repos.slice(0, 5).forEach(repo => {
    const repoEl = document.createElement('span');
    repoEl.className = 'repo-tag';
    repoEl.textContent = repo.name;
    repoList.appendChild(repoEl);
  });
}
