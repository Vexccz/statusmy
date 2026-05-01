/**
 * Socket.io instance holder
 * Avoids circular imports between server.js and controllers
 */

let _io = null;

export function setIO(io) {
  _io = io;
}

export function getIO() {
  return _io;
}
