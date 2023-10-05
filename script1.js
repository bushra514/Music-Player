const musicImg = document.querySelector(".img img");
const musicName = document.querySelector(".song-title");
const musicArtist = document.querySelector(".artist-name");
const playPauseBtn = document.querySelector(".play-pause ");
const playPauseIcon = playPauseBtn.querySelector("i");
const prevBtn = document.querySelector("#previous");
const nextBtn = document.querySelector("#next");
const mainAudio = document.querySelector("#main-audio");
const progressArea = document.querySelector(".progress-area"); 
const progressBar = document.querySelector(".progress-bar");

const musicList = document.querySelector(".music-list ul"); // Reference to the ul element

const shuffleBtn = document.getElementById("shuffle-btn");
const shuffleIcon = shuffleBtn.querySelector("i");
const repeatBtn = document.getElementById("repeat-btn");

let musicIndex = 0;
let isMusicPaused = true;

let isDurationSet = false;
let musicDuration;

// Load initial song
loadMusic(musicIndex);



// Function to load music
function loadMusic(index) {
  // Reset isDurationSet when a new song is loaded
    isDurationSet = false;

    isLoop = false; 

  musicImg.src = `images/${allMusic[index].img}.jpg`;
  musicName.textContent = allMusic[index].name;
  musicArtist.textContent = allMusic[index].artist;
  mainAudio.src = `songs/${allMusic[index].src}.mp3`;
}




// ***************** play-pause  *************************************



// Add a click event listener to the play-pause button
playPauseBtn.addEventListener("click", () => {
    // Toggle the play-pause icon between pause and play
    if (playPauseIcon.classList.contains("fa-circle-pause")) {
        // If the current icon is pause, change it to play
        playPauseIcon.classList.remove("fa-circle-pause");
        playPauseIcon.classList.add("fa-circle-play");
    } else {
        // If the current icon is play, change it to pause
        playPauseIcon.classList.remove("fa-circle-play");
        playPauseIcon.classList.add("fa-circle-pause");
    }
});



// Function to play music
function playMusic() {
  isMusicPaused = false;
  mainAudio.play();
  // playPauseBtn.textContent = "pause";
}

// Function to pause music
function pauseMusic() {
  isMusicPaused = true;
  mainAudio.pause();
//   playPauseBtn.textContent = "play_arrow";

}

// Event listener for play/pause button click
playPauseBtn.addEventListener("click", () => {
  if (isMusicPaused) {
    playMusic();
  } else {
    pauseMusic();
  }
});

// Event listener for previous button click
prevBtn.addEventListener("click", () => {
    musicIndex = (musicIndex - 1 + allMusic.length) % allMusic.length;
    loadMusic(musicIndex);
    if (!isMusicPaused) {
      playMusic();
    }
  });
  
  // Event listener for next button click
  nextBtn.addEventListener("click", () => {
    musicIndex = (musicIndex + 1) % allMusic.length;
    loadMusic(musicIndex);
    if (!isMusicPaused) {
      playMusic();
    }
  });
  

// Function to handle the next button click
function nextMusic() {
  musicIndex++; // increment musicIndex by 1
  if (musicIndex >= allMusic.length) {
      musicIndex = 0; // If it exceeds the length of the playlist, reset it to 0 for loop play
  }
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

// ********************** progress bar ********************************



// Event listener for updating progress bar width and song duration
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
  
    if (!isNaN(duration)) { // Check if duration is a valid number
      const progressWidth = (currentTime / duration) * 100;
      progressBar.style.width = `${progressWidth}%`;
  
      // Update current time
      const currentMin = Math.floor(currentTime / 60);
      const currentSec = Math.floor(currentTime % 60);
      const formattedCurrentTime = `${currentMin}:${currentSec < 10 ? "0" : ""}${currentSec}`;
      document.querySelector(".current-time").innerText = formattedCurrentTime;
  
      // Update music duration if not set
      if (!isDurationSet) {
        const totalMin = Math.floor(duration / 60);
        const totalSec = Math.floor(duration % 60);
        const formattedDuration = `${totalMin}:${totalSec < 10 ? "0" : ""}${totalSec}`;
        document.querySelector(".max-duration").innerText = formattedDuration;
        isDurationSet = true;
      }
    }
  });
  
  

// Event listener for clicking on progress bar to seek
progressArea.addEventListener("click", (e) => {
    const progressWidth = progressArea.clientWidth; // Width of the progress bar
    const clickX = e.offsetX; // X-coordinate where user clicked
    const songDuration = mainAudio.duration; // Total duration of the song
    const seekTime = (clickX / progressWidth) * songDuration; // Calculate seek time
    mainAudio.currentTime = seekTime; // Set the audio's current time to seekTime
    if (!isMusicPaused) {
      playMusic(); // If the music was playing, resume playback
    }
  });



// Update song duration when audio is loaded
mainAudio.addEventListener("loadeddata", () => {
  const audioDuration = mainAudio.duration;
  const totalMinutes = Math.floor(audioDuration / 60);
  const totalSeconds = Math.floor(audioDuration % 60);
  const formattedDuration = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
  const audioDurationElements = document.querySelectorAll(".audio-duration");
  audioDurationElements.forEach((element) => {
    element.textContent = formattedDuration;
    element.setAttribute("t-duration", formattedDuration);
  });
});



// ************************ shuffle ******************************

let isShuffle = false;

 
// Function to get a shuffled playlist
function getShuffledPlaylist() {
    const shuffledPlaylist = [...allMusic]; // Create a copy of the original playlist
    for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]]; // Swap elements
    }
    return shuffledPlaylist;
}

// Event listener for the shuffle button
shuffleBtn.addEventListener("click", () => {
  // Toggle the shuffle mode flag
  isShuffle = !isShuffle;

  // Change the color of the shuffle icon 
  if (isShuffle) {
      shuffleBtn.style.color = "#000000"; // Change to the active color
      shuffleBtn.setAttribute("title", "Shuffle is on");
  } else {
      shuffleBtn.style.color = "rgb(174, 173, 173)"; // Change to the inactive color
      shuffleBtn.setAttribute("title", "Shuffle is off");
  }

  // If shuffle mode is on, shuffle the playlist
  if (isShuffle) {
      allMusic = getShuffledPlaylist();
      musicIndex = 0; // Reset the index to play the first shuffled song
      loadMusic(musicIndex); // Load the first song
      playMusic(); // Start playing the first shuffled song
  }
});




// ********************* Repeat *********************************



let isRepeat = false;

repeatBtn.addEventListener("click", () => {
  // Toggle the shuffle mode flag
  isRepeat= !isRepeat;

  // Change the color of the shuffle icon 
  if (isRepeat) {
      repeatBtn.style.color = "#000000"; // Change to the active color
      repeatBtn.setAttribute("title", "REpeat is on");
  } else {
    repeatBtn.style.color = "rgb(174, 173, 173)"; // Change to the inactive color
    repeatBtn.setAttribute("title", "Repeat is off");
  }
});




let repeatMode = "none";


// Event listener for repeat mode
repeatBtn.addEventListener("click", () =>{

  // Toggle between repeat modes = "none" , "one" , "all"
  switch(repeatMode){
    
      case "none" : repeatMode = "one";
                    repeatBtn.classList.add("active")
                    repeatBtn.setAttribute("tittle", "Repeat one songs");
                    break;

      case "one" : repeatMode = "all";
                    repeatBtn.classList.add("active")
                    repeatBtn.setAttribute("tittle", "Repeat all songs");
                    break;

      case "all" : repeatMode = "none";
                    repeatBtn.classList.add("active")
                    repeatBtn.setAttribute("tittle", "No repeat");
                    break;


  }
});


// Function to handle what to do after a song ends on repeat mode

function handleSongEnd(){

  switch (repeatMode){

    case "none" : // Do nothing, let the player proceed to other song
                  nextMusic();
                  break;

    case "one" : //repeat the current song
                  mainAudio.currentTime = 0;  //reset the song to the begining.
                  playMusic();
                  break;

    case "all" : // move to the next song or loop the current song to beginning
                  nextMusic();
                  playMusic();

                  break;
  }
}

// Event listener to handle the end of a song
mainAudio.addEventListener("ended", () => {
  handleSongEnd();
});




// Create the music list dynamically
function createMusicList() {
  allMusic.forEach((music, index) => {
    const li = document.createElement("li");
    li.setAttribute("li-index", index);
    li.innerHTML = `
      <div class="row">
        <span>${music.name}</span>
        <p>${music.artist}</p>
      </div>
      <span id="${music.src}" class="audio-duration">3:40</span>
    `;
    li.addEventListener("click", () => {
      musicIndex = index;
      loadMusic(musicIndex);
      playMusic();
    });
    musicList.appendChild(li);
  });
}

// Call the function to create the music list
createMusicList();




  

// Function to toggle the music list
function toggleMusicList() {
  const musicListContainer = document.querySelector(".music-list-container");
  if (musicListContainer.style.display === "none" || musicListContainer.style.display === "") {
    musicListContainer.style.display = "block";
  } else {
    musicListContainer.style.display = "none";
  }
}


// Function to load the music list dynamically
function loadMusicList() {
  const musicList = document.querySelector(".music-list");
  allMusic.forEach((music, index) => {
    const li = document.createElement("li");
    li.setAttribute("li-index", index);
    li.innerHTML = `
      <div class="row">
        <span>${music.name}</span>
        <p>${music.artist}</p>
      </div>
      <span id="${music.src}" class="audio-duration">3:40</span>
    `;
    li.addEventListener("click", () => {
      musicIndex = index;
      loadMusic(musicIndex);
      playMusic();
    });
    musicList.appendChild(li);
  });
}

// Call the function to load the music list when the page loads
window.addEventListener("load", () => {
  loadMusicList();
});

