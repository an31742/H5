import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import Vue from 'vue'

Sentry.init({
  environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
  dsn: 'https://13045a6a0cda4741bca263871ffd8b70@sentry.gmtech.top/7',
  integrations: [new Integrations.Vue({ Vue, attachProps: true })],
  release: 'staff_h5@2.0.0'
})
