let isProcessing = false;
let sentiment;

function modelReady() {
  console.log("Model is ready");
}

sentiment = ml5.sentiment('movieReviews', modelReady);

async function getSentiment(text) {
  const prediction = sentiment.predict(text);
  if (prediction.score > 0.6) {
    return 'Positive';
  } else if (prediction.score < 0.4) {
    return 'Negative';
  } else {
    return 'Neutral';
  }
}

async function addSentimentToUsername(commentElement) {
  const usernameElement = commentElement.querySelector('#author-text span');
  const commentTextElement = commentElement.querySelector('#content-text');

  if (usernameElement && commentTextElement) {
    
    if (usernameElement.querySelector('.sentiment')) return;

    const sentiment = await getSentiment(commentTextElement.textContent);
    const sentimentSpan = document.createElement('span');
    sentimentSpan.textContent = ` (${sentiment})`;
    sentimentSpan.style.marginLeft = '4px';
    sentimentSpan.className = 'sentiment'; 

    
    if (sentiment === 'Positive') {
      sentimentSpan.style.color = 'green';
    } else if (sentiment === 'Negative') {
      sentimentSpan.style.color = 'red';
    } else { // Neutral
      sentimentSpan.style.color = 'yellow';
    }

    usernameElement.appendChild(sentimentSpan);
  }
}

function processComments() {
  if (isProcessing) return;
  isProcessing = true;

  console.log('Processing comments...');
  const commentElements = document.querySelectorAll('ytd-comment-renderer');
  console.log(`Found ${commentElements.length} comments.`);
  commentElements.forEach(addSentimentToUsername);

  setTimeout(() => {
    isProcessing = false;
  }, 1000);
}

function waitForComments() {
  const commentSection = document.querySelector('ytd-comments');
  if (commentSection) {
    console.log('Comment section found.');
    processComments();
    const observer = new MutationObserver(processComments);
    observer.observe(commentSection, { childList: true, subtree: true });
  } else {
    console.log('Comment section not found. Retrying in 1 second...');
    setTimeout(waitForComments, 1000);
  }
}

console.log('Starting comment sentiment analysis extension...');
waitForComments();
