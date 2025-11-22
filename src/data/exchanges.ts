export interface Exchange {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  wsUrl?: string;
  apiUrl?: string;
}

export const exchanges: Exchange[] = [
  {
    id: 'binance',
    name: 'Binance',
    lat: 35.6895, // Tokyo (Approximate for Asia region)
    lng: 139.6917,
    region: 'Asia',
    wsUrl: 'wss://stream.binance.com:9443/ws/btcusdt@trade',
    apiUrl: 'https://api.binance.com/api/v3/ping',
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    lat: 37.7749, // San Francisco
    lng: -122.4194,
    region: 'North America',
    wsUrl: 'wss://ws-feed.exchange.coinbase.com',
    apiUrl: 'https://api.exchange.coinbase.com/time',
  },
  {
    id: 'kraken',
    name: 'Kraken',
    lat: 51.5074, // London (Approximate for Europe)
    lng: -0.1278,
    region: 'Europe',
    wsUrl: 'wss://ws.kraken.com',
    apiUrl: 'https://api.kraken.com/0/public/Time',
  },
  {
    id: 'bitfinex',
    name: 'Bitfinex',
    lat: 18.4655, // British Virgin Islands
    lng: -64.6238,
    region: 'Caribbean',
    wsUrl: 'wss://api-pub.bitfinex.com/ws/2',
    apiUrl: 'https://api-pub.bitfinex.com/v2/platform/status',
  },
  {
    id: 'huobi',
    name: 'HTX (Huobi)',
    lat: 1.3521, // Singapore
    lng: 103.8198,
    region: 'Asia',
    wsUrl: 'wss://api.huobi.pro/ws',
    apiUrl: 'https://api.huobi.pro/v1/common/timestamp',
  },
];
