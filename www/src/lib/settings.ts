export const SERVER_HOST = import.meta.env.VITE_SERVER_HOST ?? '/';
export const SERVER_PORT = import.meta.env.VITE_SERVER_PORT ?? '7089';

const url = new URL(SERVER_HOST, location.href);
url.port = SERVER_PORT;
export const SERVER_URL = url.toString();
export const SIGNAL_R_HUB = '/game';

export const USERS_PER_SESSION = 6;
export const WINNERS_PER_SESSION = 2;

export const ROUND_TIME = (1 * 60 + 30) * 1000;

export const MAX_SCORE = 256;
