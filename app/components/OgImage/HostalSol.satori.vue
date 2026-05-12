<template>
  <div
    style="
      display: flex;
      flex-direction: row;
      width: 1200px;
      height: 630px;
      background: #f7f4ee;
      font-family: sans-serif;
      overflow: hidden;
      position: relative;
    "
  >
    <!-- Background logo watermark -->
    <img
      src="/images/logo-icon.svg"
      style="position: absolute; right: -60px; bottom: -60px; width: 480px; height: 480px; object-fit: contain; opacity: 0.13;"
    />

    <!-- Left green accent bar -->
    <div style="width: 16px; background: #687e56; flex-shrink: 0;" />

    <!-- Main content -->
    <div
      style="
        display: flex;
        flex-direction: column;
        padding: 62px 76px 54px 72px;
        flex: 1;
        justify-content: space-between;
      "
    >
      <!-- Brand header: logo + name -->
      <div style="display: flex; align-items: center; gap: 18px;">
        <img
          src="/images/logo-icon.svg"
          width="56"
          height="56"
          style="width: 56px; height: 56px; object-fit: contain;"
        />
        <div style="display: flex; flex-direction: column; gap: 3px;">
          <div
            style="
              font-size: 17px;
              font-weight: 700;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: #687e56;
            "
          >
            HOSTAL SOL
          </div>
          <div
            style="
              font-size: 11px;
              color: #aaa;
              letter-spacing: 0.16em;
              text-transform: uppercase;
            "
          >
            {{ t('ogImage.location') }}
          </div>
        </div>
      </div>

      <!-- Title + tagline -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div
          style="
            font-size: 54px;
            font-weight: 600;
            color: #2a2a22;
            line-height: 1.08;
            max-width: 900px;
          "
        >
          {{ title }}
        </div>
        <div
          style="
            font-size: 26px;
            color: #687e56;
            font-weight: 500;
            letter-spacing: 0.015em;
            max-width: 750px;
          "
        >
          {{ subtitle }}
        </div>
      </div>

      <!-- Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 15px; color: #bbb; letter-spacing: 0.04em;">
          hostalsolzamora.com
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            gap: 8px;
            background: #687e56;
            color: #fff;
            padding: 10px 24px;
            border-radius: 100px;
            font-size: 14px;
            font-weight: 600;
          "
        >
          <div style="color: #c9a84c;">★</div>
          <div>7.7 · Centro Histórico</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title:    'Hostal Sol Zamora',
    subtitle: 'Tu hogar en Zamora',
  },
)
</script>
