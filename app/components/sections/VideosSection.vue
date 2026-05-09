<template>
  <section class="videos">
    <div class="videos__header">
      <UiSectionTag light>{{ t('videos.title') }}</UiSectionTag>
      <h2 class="videos__heading">{{ t('videos.title') }}</h2>
      <p class="videos__sub">{{ t('videos.sub') }}</p>
    </div>

    <!-- Channel embed -->
    <div class="videos__embed-wrap">
      <iframe
        :src="`https://www.youtube.com/embed?listType=playlist&list=UU${YT_CHANNEL_ID.slice(2)}&rel=0`"
        title="Hostal Sol Zamora Videos"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="videos__embed"
        loading="lazy"
      />
    </div>

    <!-- Room shorts carousel -->
    <div class="videos__carousel-wrap">
      <button class="videos__arrow videos__arrow--left" aria-label="Anterior" @click="scroll(-1)">
        <LucideIcon name="chevron-left" :size="20" color="#fff" />
      </button>

      <div ref="track" class="videos__track">
        <a
          v-for="room in roomKeys"
          :key="room"
          :href="YT_SHORTS_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="videos__card"
        >
          <div class="videos__card-thumb">
            <img
              :src="roomPhotoPaths(room)[0] ?? '/images/rooms/1.jpg'"
              :alt="room"
              loading="lazy"
              class="videos__card-img"
            />
            <div class="videos__card-play">
              <LucideIcon name="play" :size="18" color="#fff" />
            </div>
          </div>
          <div class="videos__card-info">
            <div class="videos__card-room">{{ room === 'Entrada' ? t('rooms.entrance') : `Hab. ${room}` }}</div>
            <div class="videos__card-sub">YouTube Shorts ↗</div>
          </div>
        </a>
      </div>

      <button class="videos__arrow videos__arrow--right" aria-label="Siguiente" @click="scroll(1)">
        <LucideIcon name="chevron-right" :size="20" color="#fff" />
      </button>
    </div>

    <!-- CTAs -->
    <div class="videos__ctas">
      <a :href="YT_SHORTS_URL" target="_blank" rel="noopener noreferrer" class="videos__cta-yt">
        <LucideIcon name="play" :size="14" color="#fff" /> {{ t('videos.watch') }}
      </a>
      <a :href="`https://www.youtube.com/channel/${YT_CHANNEL_ID}`" target="_blank" rel="noopener noreferrer" class="videos__cta-ch">
        <LucideIcon name="tv-2" :size="14" color="#fff" /> {{ t('videos.channel') }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { YT_CHANNEL_ID, YT_SHORTS_URL } from '~/composables/useRooms'

const { t } = useI18n()
const { photoUrl, roomPhotoPaths, roomKeys } = useRooms()

const track = ref<HTMLElement | null>(null)

function scroll(dir: 1 | -1) {
  track.value?.scrollBy({ left: dir * 280, behavior: 'smooth' })
}
</script>

<style scoped>
.videos {
  background: var(--dark);
  padding: 80px 0;
  overflow: hidden;
}

.videos__header { padding: 0 max(24px, 6vw) 36px; }

.videos__heading {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  color: #fff;
  margin: 0 0 8px;
}
.videos__sub { color: rgba(255,255,255,0.5); }

.videos__embed-wrap {
  padding: 0 max(24px, 6vw) 28px;
  border-radius: 14px;
  overflow: hidden;
}
.videos__embed {
  width: 100%;
  aspect-ratio: 16/9;
  border: none;
  display: block;
  border-radius: 14px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.4);
}

.videos__carousel-wrap {
  position: relative;
  padding: 0 0 8px;
}

.videos__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(0,0,0,0.6);
  border: none;
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.videos__arrow:hover { background: rgba(0,0,0,0.85); }
.videos__arrow--left  { left: max(8px, 2vw); }
.videos__arrow--right { right: max(8px, 2vw); }

.videos__track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px max(24px, 6vw);
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.videos__track::-webkit-scrollbar { display: none; }

.videos__card {
  flex-shrink: 0;
  width: 200px;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  transition: background 0.2s, transform 0.2s;
}
.videos__card:hover {
  background: rgba(104,126,86,0.25);
  transform: translateY(-2px);
}

.videos__card-thumb {
  height: 140px;
  overflow: hidden;
  position: relative;
  background: #111;
}
.videos__card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}
.videos__card-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.videos__card-play > * {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}

.videos__card-info { padding: 12px 14px; }
.videos__card-room { color: #fff; font-weight: 600; font-size: 13.5px; }
.videos__card-sub  { color: rgba(255,255,255,0.45); font-size: 12px; margin-top: 3px; }

.videos__ctas {
  padding: 24px max(24px, 6vw) 0;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.videos__cta-yt {
  background: var(--youtube);
  color: #fff;
  border-radius: 8px;
  padding: 11px 24px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  transition: opacity 0.2s;
}
.videos__cta-yt:hover { opacity: 0.85; }

.videos__cta-ch {
  background: rgba(255,255,255,0.1);
  color: #fff;
  border-radius: 8px;
  padding: 11px 24px;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.2);
  display: inline-flex;
  gap: 8px;
  align-items: center;
  transition: background 0.2s;
}
.videos__cta-ch:hover { background: rgba(255,255,255,0.18); }
</style>
