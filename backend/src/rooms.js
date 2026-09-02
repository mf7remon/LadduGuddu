const rooms = new Map();


function generateRoomCode() {

  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

}



function createRoom(hostSocketId) {

  let code;

  do {

    code = generateRoomCode();

  } while (rooms.has(code));


  rooms.set(code, {

    host: hostSocketId,
    guest: null,

  });


  return code;

}



function joinRoom(code, guestSocketId) {

  const room = rooms.get(code);


  if (!room) {

    return false;

  }


  if (room.guest) {

    return false;

  }


  room.guest = guestSocketId;


  return true;

}



function getRoom(code) {

  return rooms.get(code);

}



module.exports = {

  createRoom,
  joinRoom,
  getRoom,

};