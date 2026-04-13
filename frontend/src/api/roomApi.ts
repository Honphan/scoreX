// === Room API Service ===
// Currently uses local Zustand store. These functions are placeholders
// for future integration with a Spring Boot backend via axiosClient.

// import axiosClient from "./axiosClient";

export const roomApi = {
  // Future: POST /api/rooms
  // createRoom: (data: { name: string; hostName: string }) =>
  //   axiosClient.post("/rooms", data),

  // Future: POST /api/rooms/:roomId/rounds
  // saveRound: (roomId: string, scores: RoundScore[]) =>
  //   axiosClient.post(`/rooms/${roomId}/rounds`, { scores }),

  // Future: PUT /api/rooms/:roomId/players/:playerId/override
  // overrideTotalScore: (roomId: string, playerId: string, newTotal: number, note?: string) =>
  //   axiosClient.put(`/rooms/${roomId}/players/${playerId}/override`, { newTotal, note }),
};
