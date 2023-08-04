/* eslint-disable */
const API_KEY =
  "de7c9cfd59397921c8fbd17446a0b0f1dd2cd2cd6188d98122d04819b7008a8b";

const tickersHandler = new Map();

const loadTickers = () => {
  if (tickersHandler.size === 0) {
    return;
  }
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsym=${[
      ...tickersHandler.keys(),
    ].join(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then((rawData) => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandler.get(currency) ?? [];
        handlers.forEach(fn => fn(newPrice));
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandler.get(ticker) || [];
  tickersHandler.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandler.delete(ticker);
};

setInterval(loadTickers, 5000);
