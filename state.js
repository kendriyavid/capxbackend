import EventEmitter from 'events';

export const clientConnections = new Map();
export const stockUpdates = new EventEmitter();
