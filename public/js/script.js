// Initialize Canvas Confetti
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Check for missing features
const browserMessage = document.getElementById('browser-message');
if (!window.AudioContext && !window.webkitAudioContext) {
  browserMessage.style.display = 'block';
}

// Close the message when the close button is clicked
document.getElementById('close-message').addEventListener('click', () => {
  browserMessage.style.display = 'none';
});

// Fireworks Animation
let fireworksInterval;

function createFireworks() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function startFireworks() {
  fireworksInterval = setInterval(createFireworks, 2000);
}

document.addEventListener('click', () => {
  startFireworks();
  document.removeEventListener('click', startFireworks);
}, { once: true });

// I Love You Animation
const qs = document.querySelector.bind(document);
const easingHeart = mojs.easing.path("M0,100C2.9,86.7,33.6-7.3,46-7.3s15.2,22.7,26,22.7S89,0,100,0");

const el = {
  container: qs(".mo-container"),
  i: qs(".lttr--I"),
  l: qs(".lttr--L"),
  o: qs(".lttr--O"),
  v: qs(".lttr--V"),
  e: qs(".lttr--E"),
  y: qs(".lttr--Y"),
  o2: qs(".lttr--O2"),
  u: qs(".lttr--U"),
  lineLeft: qs(".line--left"),
  lineRight: qs(".line--rght"),
  colTxt: "#763c8c",
  colHeart: "#fa4843",
  blup: qs(".blup"),
  blop: qs(".blop"),
  sound: qs(".sound"),
};

class Heart extends mojs.CustomShape {
  getShape() {
    return '<path d="M50,88.9C25.5,78.2,0.5,54.4,3.8,31.1S41.3,1.8,50,29.9c8.7-28.2,42.8-22.2,46.2,1.2S74.5,78.2,50,88.9z"/>';
  }
  getLength() {
    return 200;
  }
}

mojs.addShape("heart", Heart);

const crtBoom = (delay = 0, x = 0, rd = 46) => {
  const parent = el.container;
  const crcl = new mojs.Shape({
    shape: "circle",
    fill: "none",
    stroke: el.colTxt,
    strokeWidth: { 5: 0 },
    radius: { [rd]: [rd + 20] },
    easing: "quint.out",
    duration: 500 / 3,
    parent,
    delay,
    x,
  });

  const brst = new mojs.Burst({
    radius: { [rd + 15]: 110 },
    angle: "rand(60, 180)",
    count: 3,
    timeline: { delay },
    parent,
    x,
    children: {
      radius: [5, 3, 7],
      fill: el.colTxt,
      scale: { 1: 0, easing: "quad.in" },
      pathScale: [0.8, null],
      degreeShift: ["rand(13, 60)", null],
      duration: 1000 / 3,
      easing: "quint.out",
    },
  });

  return [crcl, brst];
};

const crtLoveTl = () => {
  const move = 1000;
  const boom = 200;
  const easing = "sin.inOut";
  const easingBoom = "sin.in";
  const easingOut = "sin.out";
  const opts = { duration: move, easing, opacity: 1 };
  const delta = 150;

  return new mojs.Timeline().add([
    new mojs.Tween({
      duration: move,
      onStart: () => {
        [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach((el) => {
          el.style.opacity = 1;
          el.style =
            "transform: translate(0px, 0px) rotate(0deg) skew(0deg, 0deg) scale(1, 1); opacity: 1;";
        });
      },
      onComplete: () => {
        [el.l, el.o, el.v, el.e].forEach((el) => (el.style.opacity = 0));
        el.blop.play().catch((error) => {
          // console.error("Audio playback failed:", error);
        });
      },
    }),

    new mojs.Tween({
      duration: move * 2 + boom,
      onComplete: () => {
        [el.y, el.o2].forEach((el) => (el.style.opacity = 0));
        el.blop.play().catch((error) => {
          // console.error("Audio playback failed:", error);
        });
      },
    }),

    new mojs.Tween({
      duration: move * 3 + boom * 2 - delta,
      onComplete: () => {
        el.i.style.opacity = 0;
        el.blop.play().catch((error) => {
          // console.error("Audio playback failed:", error);
        });
      },
    }),

    new mojs.Tween({
      duration: move * 3 + boom * 2,
      onComplete: () => {
        el.u.style.opacity = 0;
        el.blup.play().catch((error) => {
          // console.error("Audio playback failed:", error);
        });
      },
    }),

    new mojs.Tween({
      duration: 50,
      delay: 4050,
      onUpdate: (progress) => {
        [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach((el) => {
          el.style = `transform: translate(0px, 0px) rotate(0deg) skew(0deg, 0deg) scale(1, 1); opacity: ${1 * progress
            };`;
        });
      },
      onComplete: () => {
        [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach((el) => {
          el.style.opacity = 1;
          el.style =
            "transform: translate(0px, 0px) rotate(0deg) skew(0deg, 0deg) scale(1, 1); opacity: 1;";
        });
      },
    }),

    new mojs.Html({
      ...opts,
      el: el.lineLeft,
      x: { 0: 52 },
    })
      .then({
        duration: boom + move,
        easing,
        x: { to: 52 + 54 },
      })
      .then({
        duration: boom + move,
        easing,
        x: { to: 52 + 54 + 60 },
      })
      .then({
        duration: 150,
        easing,
        x: { to: 52 + 54 + 60 + 10 },
      })
      .then({
        duration: 300,
      })
      .then({
        duration: 350,
        x: { to: 0 },
        easing: easingOut,
      }),

    new mojs.Html({
      ...opts,
      el: el.lineRight,
      x: { 0: -52 },
    })
      .then({
        duration: boom + move,
        easing,
        x: { to: -52 - 54 },
      })
      .then({
        duration: boom + move,
        easing,
        x: { to: -52 - 54 - 60 },
      })
      .then({
        duration: 150,
        easing,
        x: { to: -52 - 54 - 60 - 10 },
      })
      .then({
        duration: 300,
      })
      .then({
        duration: 350,
        x: { to: 0 },
        easing: easingOut,
      }),

    new mojs.Html({
      ...opts,
      el: el.i,
      x: { 0: 34 },
    })
      .then({
        duration: boom,
        easing: easingBoom,
        x: { to: 34 + 19 },
      })
      .then({
        duration: move,
        easing,
        x: { to: 34 + 19 + 40 },
      })
      .then({
        duration: boom,
        easing: easingBoom,
        x: { to: 34 + 19 + 40 + 30 },
      })
      .then({
        duration: move,
        easing,
        x: { to: 34 + 19 + 40 + 30 + 30 },
      }),

    new mojs.Html({
      ...opts,
      el: el.l,
      x: { 0: 15 },
    }),

    new mojs.Html({
      ...opts,
      el: el.o,
      x: { 0: 11 },
    }),

    new mojs.Html({
      ...opts,
      el: el.v,
      x: { 0: 3 },
    }),

    new mojs.Html({
      ...opts,
      el: el.e,
      x: { 0: -3 },
    }),

    new mojs.Html({
      ...opts,
      el: el.y,
      x: { 0: -20 },
    })
      .then({
        duration: boom,
        easing: easingBoom,
        x: { to: -20 - 33 },
      })
      .then({
        duration: move,
        easing,
        x: { to: -20 - 33 - 24 },
      }),

    new mojs.Html({
      ...opts,
      el: el.o2,
      x: { 0: -27 },
    })
      .then({
        duration: boom,
        easing: easingBoom,
        x: { to: -27 - 27 },
      })
      .then({
        duration: move,
        easing,
        x: { to: -27 - 27 - 30 },
      }),

    new mojs.Html({
      ...opts,
      el: el.u,
      x: { 0: -32 },
    })
      .then({
        duration: boom,
        easing: easingBoom,
        x: { to: -32 - 21 },
      })
      .then({
        duration: move,
        easing,
        x: { to: -32 - 21 - 36 },
      })
      .then({
        duration: boom,
        easing: easingBoom,
        x: { to: -32 - 21 - 36 - 31 },
      })
      .then({
        duration: move,
        easing,
        x: { to: -32 - 21 - 36 - 31 - 27 },
      }),

    new mojs.Shape({
      parent: el.container,
      shape: "heart",
      delay: move,
      fill: el.colHeart,
      x: -64,
      scale: { 0: 0.95, easing: easingHeart },
      duration: 500,
    })
      .then({
        x: { to: -62, easing },
        scale: { to: 0.65, easing },
        duration: boom + move - 500,
      })
      .then({
        duration: boom - 50,
        x: { to: -62 + 48 },
        scale: { to: 0.9 },
        easing: easingBoom,
      })
      .then({
        duration: 125,
        scale: { to: 0.8 },
        easing: easingOut,
      })
      .then({
        duration: 125,
        scale: { to: 0.85 },
        easing: easingOut,
      })
      .then({
        duration: move - 200,
        scale: { to: 0.45 },
        easing,
      })
      .then({
        delay: -75,
        duration: 150,
        x: { to: 0 },
        scale: { to: 0.9 },
        easing: easingBoom,
      })
      .then({
        duration: 125,
        scale: { to: 0.8 },
        easing: easingOut,
      })
      .then({
        duration: 125,
        scale: { to: 0.85 },
        easing: easingOut,
      })
      .then({
        duration: 125,
      })
      .then({
        duration: 350,
        scale: { to: 0 },
        easing: easingOut,
      }),

    ...crtBoom(move, -64, 46),
    ...crtBoom(move * 2 + boom, 18, 34),
    ...crtBoom(move * 3 + boom * 2 - delta, -64, 34),
    ...crtBoom(move * 3 + boom * 2, 45, 34),
  ]);
};

const loveTl = crtLoveTl().play();
setInterval(() => {
  loveTl.replay();
}, 4300);

const volume = 0.2;
el.blup.volume = volume;
el.blop.volume = volume;

let audioEnabled = false;

const toggleSound = () => {
  if (!audioEnabled) {
    el.blup.play().then(() => {
      el.blup.pause();
      el.blup.currentTime = 0;
      audioEnabled = true;
    }).catch(error => {
      console.error("Playback prevented:", error);
    });
  }

  let on = true;
  return () => {
    if (on) {
      el.blup.volume = 0.0;
      el.blop.volume = 0.0;
      el.sound.classList.add("sound--off");
    } else {
      el.blup.volume = volume;
      el.blop.volume = volume;
      el.sound.classList.remove("sound--off");
    }
    on = !on;
  };
};

// Attach toggleSound to a user interaction event
document.addEventListener("click", () => {
  toggleSound();  // Ensure this function runs only after user interaction
}, { once: true });  // Ensures it only runs once


// el.sound.addEventListener("click", toggleSound());

// Share Functionality
const shareButton = document.getElementById('share-button');
const overlay = document.getElementById('overlay');
const sharePopup = document.getElementById('share-popup');
const closePopup = document.getElementById('close-popup');
const shareForm = document.getElementById('share-form');
const shareLinkContainer = document.getElementById('share-link-container');
const shareLinkInput = document.getElementById('share-link');
const copyLinkButton = document.getElementById('copy-link');

const baseUrl = 'http://localhost:3000';

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const receiver = params.get('receiver');
  const note = params.get('note');
  return { receiver, note };
}

function updateCardContent(receiver, note) {
  const userNameElement = document.getElementById('user-name');
  const noteDisplayElement = document.getElementById('note-display');  // Get the new element

  if (receiver) {
    userNameElement.textContent = decodeURIComponent(receiver);
  }

  if (note) {
    console.log(note);
    console.log(decodeURIComponent(note));
    noteDisplayElement.textContent = decodeURIComponent(note); // Update its text content
  } else {
    noteDisplayElement.textContent = ''; // Clear the note if it's not provided
  }
}



window.onload = () => {
  const { receiver, note } = getUrlParams();
  if (receiver || note) {
    updateCardContent(receiver, note);
  }
};

shareButton.addEventListener('click', () => {
  overlay.style.display = 'block';
  sharePopup.style.display = 'block';
});

closePopup.addEventListener('click', () => {
  overlay.style.display = 'none';
  sharePopup.style.display = 'none';
});

overlay.addEventListener('click', () => {
  overlay.style.display = 'none';
  sharePopup.style.display = 'none';
});

// ... other code ...

shareForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const receiverName = document.getElementById('receiver-name').value;
  const specialNote = document.getElementById('special-note').value;


  // Constraint: Limit note to 20 characters with feedback
  if (specialNote.length > 20) {
    alert('Special note should not exceed 20 characters.');
    return;
  }

  const shareableLink = `${baseUrl}?receiver=${encodeURIComponent(receiverName)}&note=${encodeURIComponent(specialNote)}`;
  console.log(shareableLink);
  saveLink(shareableLink);
  shareLinkInput.value = shareableLink;
  shareLinkContainer.style.display = 'block';
});


function saveLink(link) {
  fetch('/save-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ link: link })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log(data.message);
    } else {
      console.log('Failed to save link:', data.message);
    }
  })
  .catch(error => console.log('Error:', error));
}



//Character Count Limit and message for the textarea

const specialNoteTextarea = document.getElementById('special-note');
const charCountMessage = document.createElement('p'); // Create a <p> element for the message
charCountMessage.id = 'char-count-message';
specialNoteTextarea.parentNode.insertBefore(charCountMessage, specialNoteTextarea.nextSibling); // Insert message


specialNoteTextarea.addEventListener('input', () => {
  const maxLength = 20;
  if (specialNoteTextarea.value.length > maxLength) {
    specialNoteTextarea.value = specialNoteTextarea.value.slice(0, maxLength); // Truncate the input
  }
  // Update the character count message
  charCountMessage.textContent = `Note (max 20 characters): ${specialNoteTextarea.value.length}/20`;

});


// ... rest of the code ...



copyLinkButton.addEventListener('click', () => {
  shareLinkInput.select();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareLinkInput.value).then(() => {
      alert('Link copied to clipboard!');
    });
  } else {
    document.execCommand('copy');
    alert('Link copied to clipboard!');
  }
});