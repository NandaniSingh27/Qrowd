import api from './axios';

export const createRoom = (data) => api.post('/rooms', data);
export const getMyRooms = () => api.get('/rooms/mine');
export const getRoomByCode = (code) => api.get(`/rooms/${code}`);
export const toggleRoom = (id) => api.patch(`/rooms/${id}/toggle`);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);