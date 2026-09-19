import { io } from 'socket.io-client';
import { BASE_URL, getAccessToken } from '../../auth/services/auth.api';

export function createRoomSocket() {
  return io(BASE_URL || window.location.origin, {
    auth: { token: getAccessToken() },
    withCredentials: true,
  });
}
