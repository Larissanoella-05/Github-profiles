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
  profileContainer.classList.remove('hidden');
  profileContainer.innerHTML = `<p class="text-red-400 font-semibold">${error.message}</p>`;
});

}

function displayUserProfile(user) {
  profileContainer.classList.remove('hidden');
  profileContainer.innerHTML = `
    <div class="flex items-center space-x-4 mb-4">
      <img src="${user.avatar_url}" alt="${user.name}'s profile picture" class="w-24 h-24 rounded-full">
      <div>
        <h2 class="text-2xl font-semibold">${user.name}</h2>
        <p class="text-sm">${user.bio || "No bio available"}</p>
      </div>
    </div>
    <p class="mb-4 text-sm">${user.followers} <strong>Followers</strong> • ${user.following} <strong>Following</strong> • ${user.public_repos} <strong>Repos</strong></p>
    <div id="repoList" class="flex flex-wrap gap-2"></div>
  `;
}

function displayUserRepos(repos) {
  const repoList = document.getElementById('repoList');
  repoList.innerHTML = "";
  repos.slice(0, 5).forEach(repo => {
    const repoEl = document.createElement('span');
    repoEl.className = 'bg-blue-900 px-3 py-1 rounded-full text-white text-sm';
    repoEl.textContent = repo.name;
    repoList.appendChild(repoEl);
  });
}
