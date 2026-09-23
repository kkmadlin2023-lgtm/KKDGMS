import { timeAgo } from '../js/utils/date.utils.js';

export default class StoryViewer {
  constructor({ container }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.stories = [];
    this.currentIndex = -1;
    this.isOpen = false;
    this.timer = null;
    this.progress = 0;
    this.STORY_DURATION = 5000; // 5 seconds per story
    this.updateInterval = 50; // update progress every 50ms
  }

  setStories(stories) {
    this.stories = stories.map(s => ({...s, seen: s.seen || false}));
    this.renderRow();
  }

  open(index) {
    if (index < 0 || index >= this.stories.length) return;
    this.currentIndex = index;
    this.isOpen = true;
    this.stories[this.currentIndex].seen = true;
    this.renderRow(); // Update seen status on row
    this.renderViewer();
    this.startTimer();
  }

  close() {
    this.isOpen = false;
    this.stopTimer();
    this.renderViewer();
  }

  next() {
    if (this.currentIndex < this.stories.length - 1) {
      this.open(this.currentIndex + 1);
    } else {
      this.close();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.open(this.currentIndex - 1);
    } else {
      this.resetTimer();
    }
  }

  startTimer() {
    this.stopTimer();
    this.progress = 0;
    
    // Auto-advance logic
    this.timer = setInterval(() => {
      this.progress += (this.updateInterval / this.STORY_DURATION) * 100;
      
      const progressBar = document.getElementById('story-progress-bar');
      if (progressBar) {
        progressBar.style.width = \`\${this.progress}%\`;
      }

      if (this.progress >= 100) {
        this.next();
      }
    }, this.updateInterval);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetTimer() {
    this.startTimer();
  }

  renderRow() {
    if (!this.container) return;

    // Check if we already have the row container
    let rowContainer = this.container.querySelector('.story-row-container');
    if (!rowContainer) {
      this.container.innerHTML = \`
        <div class="story-row-container flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x"></div>
        <div class="story-viewer-portal"></div>
      \`;
      rowContainer = this.container.querySelector('.story-row-container');
    }

    if (this.stories.length === 0) {
      rowContainer.innerHTML = \`
        <div class="flex flex-col items-center justify-center w-full py-6 text-[var(--text-secondary)]">
          <i data-lucide="image" class="w-8 h-8 mb-2 opacity-50"></i>
          <p class="text-sm">No stories available</p>
        </div>
      \`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const html = this.stories.map((story, idx) => \`
      <div class="flex flex-col items-center gap-1 cursor-pointer snap-start story-circle" data-index="\${idx}">
        <div class="relative w-16 h-16 rounded-full p-0.5 \${!story.seen ? 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600' : 'bg-[var(--border)]'}">
          <img src="\${story.userAvatar || 'https://ui-avatars.com/api/?name='+encodeURIComponent(story.userName)}" alt="\${story.userName}" class="w-full h-full rounded-full object-cover border-2 border-[var(--surface)]">
        </div>
        <span class="text-xs font-medium text-[var(--text)] w-16 truncate text-center">\${story.userName}</span>
      </div>
    \`).join('');

    rowContainer.innerHTML = html;

    const circles = rowContainer.querySelectorAll('.story-circle');
    circles.forEach(circle => {
      circle.addEventListener('click', () => {
        this.open(parseInt(circle.getAttribute('data-index')));
      });
    });
  }

  renderViewer() {
    const portal = this.container.querySelector('.story-viewer-portal');
    if (!portal) return;

    if (!this.isOpen || this.currentIndex === -1) {
      portal.innerHTML = '';
      return;
    }

    const story = this.stories[this.currentIndex];

    let contentHtml = '';
    if (story.type === 'video') {
      contentHtml = \`<video src="\${story.mediaUrl}" class="w-full h-full object-contain" autoplay playsinline></video>\`;
    } else if (story.type === 'image') {
      contentHtml = \`<img src="\${story.mediaUrl}" class="w-full h-full object-contain" alt="Story content">\`;
    } else {
      contentHtml = \`<div class="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white text-center text-xl font-medium">\${story.text}</div>\`;
    }

    const html = \`
      <div class="fixed inset-0 z-[100] bg-black flex items-center justify-center touch-none">
        
        <!-- Progress Bars container -->
        <div class="absolute top-0 left-0 w-full z-10 px-2 pt-2 flex gap-1">
          \${this.stories.map((_, idx) => \`
            <div class="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div class="h-full bg-white transition-all duration-75 \${idx < this.currentIndex ? 'w-full' : (idx === this.currentIndex ? 'w-0' : 'w-0')}" 
                   \${idx === this.currentIndex ? 'id="story-progress-bar"' : ''}></div>
            </div>
          \`).join('')}
        </div>

        <!-- Header -->
        <div class="absolute top-4 left-0 w-full z-10 px-4 py-2 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <div class="flex items-center gap-3">
            <img src="\${story.userAvatar || 'https://ui-avatars.com/api/?name='+encodeURIComponent(story.userName)}" alt="User" class="w-10 h-10 rounded-full object-cover border border-white/20">
            <div>
              <p class="text-white text-sm font-semibold">\${story.userName}</p>
              <p class="text-white/70 text-xs">\${timeAgo(new Date(story.timestamp))}</p>
            </div>
          </div>
          <button class="story-close-btn p-2 text-white/80 hover:text-white rounded-full bg-black/20 backdrop-blur-sm">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="w-full h-full max-w-md mx-auto relative bg-zinc-900 flex items-center justify-center">
          \${contentHtml}
          
          <!-- Tap Zones -->
          <div class="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer story-prev-zone"></div>
          <div class="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer story-next-zone"></div>
          <div class="absolute inset-0 w-full h-full z-10 cursor-pointer story-pause-zone"></div>

          <!-- Caption -->
          \${story.caption ? \`
            <div class="absolute bottom-16 left-0 w-full p-4 z-10 bg-gradient-to-t from-black/80 to-transparent">
              <p class="text-white text-sm">\${story.caption}</p>
            </div>
          \` : ''}

          <!-- View Count (if admin/creator) -->
          \${story.views ? \`
            <div class="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-white/80 text-xs bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              \${story.views}
            </div>
          \` : ''}
        </div>
      </div>
    \`;

    portal.innerHTML = html;

    if (window.lucide) {
      lucide.createIcons();
    }

    // Interactions
    const closeBtn = portal.querySelector('.story-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    const prevZone = portal.querySelector('.story-prev-zone');
    if (prevZone) prevZone.addEventListener('click', (e) => { e.stopPropagation(); this.prev(); });

    const nextZone = portal.querySelector('.story-next-zone');
    if (nextZone) nextZone.addEventListener('click', (e) => { e.stopPropagation(); this.next(); });

    const pauseZone = portal.querySelector('.story-pause-zone');
    if (pauseZone) {
      pauseZone.addEventListener('mousedown', () => this.stopTimer());
      pauseZone.addEventListener('touchstart', () => this.stopTimer());
      pauseZone.addEventListener('mouseup', () => this.startTimer());
      pauseZone.addEventListener('touchend', () => this.startTimer());
    }
  }
}
