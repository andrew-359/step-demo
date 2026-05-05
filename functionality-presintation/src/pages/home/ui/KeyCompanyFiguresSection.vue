<script setup lang="ts">
import {
  demoProtocol,
  figureReviewSummary,
  setFigureMarker,
  setFigureReviewStatus,
} from '@/pages/home/model/demoProtocol'

const figureMarkers = ['кандидат', 'ЛВР', 'ЛПР'] as const
</script>

<template>
  <article class="key-figures" aria-labelledby="key-figures-title">
    <header class="section-report-header">
      <h1 id="key-figures-title">Ключевые директора и менеджмент</h1>
      <p>справочная информация</p>
    </header>

    <div class="key-figures__body">
      <section class="review-queue" aria-label="Очередь проверки">
        <div>
          <span>Фигуры</span>
          <strong>{{ figureReviewSummary.total }}</strong>
        </div>
        <div>
          <span>Требуют проверки</span>
          <strong>{{ figureReviewSummary.pending }}</strong>
        </div>
        <div>
          <span>Подтверждено</span>
          <strong>{{ figureReviewSummary.confirmed }}</strong>
        </div>
        <div>
          <span>ЛПР/ЛВР не подтверждены</span>
          <strong>{{ figureReviewSummary.unconfirmedDecisionMakers }}</strong>
        </div>
      </section>

      <section class="key-figures__grid" aria-label="Ключевые фигуры">
        <article
          v-for="figure in demoProtocol.keyFigures"
          :key="figure.id"
          class="figure-card"
        >
          <div class="figure-card__top" aria-hidden="true"></div>
          <div class="figure-card__content">
            <div class="figure-card__badges">
              <span class="protocol-badge protocol-badge--role">
                {{ figure.marker }}
              </span>
              <span
                class="protocol-badge"
                :class="`protocol-badge--${figure.reviewStatus === 'подтверждено' ? 'confirmed' : figure.reviewStatus === 'отклонено' ? 'rejected' : 'pending'}`"
              >
                {{ figure.reviewStatus }}
              </span>
            </div>
            <h2>
              <span v-for="nameLine in figure.name" :key="nameLine">
                {{ nameLine }}
              </span>
            </h2>
            <div class="figure-card__accent" aria-hidden="true"></div>
            <p class="figure-card__role">{{ figure.role }}</p>
            <p class="figure-card__meta">{{ figure.inn }}</p>
            <p class="figure-card__meta">{{ figure.period }}</p>
            <p class="figure-card__meta">
              Уверенность {{ figure.confidence }}% · {{ figure.source }}
            </p>
            <div class="figure-card__role-switch" aria-label="Роль в протоколе">
              <button
                v-for="marker in figureMarkers"
                :key="marker"
                type="button"
                :class="{ 'figure-card__role-switch-button--active': figure.marker === marker }"
                @click="setFigureMarker(figure.id, marker)"
              >
                {{ marker }}
              </button>
            </div>
            <p class="figure-card__note" :class="`figure-card__note--${figure.tone}`">
              {{ figure.note }}
            </p>
            <div class="figure-card__actions" aria-label="Проверка фигуры">
              <button
                type="button"
                @click="setFigureReviewStatus(figure.id, 'подтверждено')"
              >
                Подтвердить
              </button>
              <button
                type="button"
                @click="setFigureReviewStatus(figure.id, 'отклонено')"
              >
                Отклонить
              </button>
            </div>
          </div>
        </article>
      </section>

      <p class="key-figures__source">Источники: ГЛОБАС, ЕГРЮЛ, Интерфакс</p>
    </div>
  </article>
</template>
