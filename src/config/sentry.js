import * as Sentry from "@sentry/node"
Sentry.init({
    dsn: "https://7cb7ba51144a9a28e326b90cb8322743@sentry.lyr.id/13",
  
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
  });