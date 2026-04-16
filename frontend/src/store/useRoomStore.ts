import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player, Room, Round, RoundScore } from "@/types";

// Helper: generate a short unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

interface RoomState {
  rooms: Room[];
  activeRoomId: string | null;

  // Room management
  createRoom: (name: string, hostName: string, expectedTotal?: number | null) => string;
  deleteRoom: (roomId: string) => void;
  setActiveRoom: (roomId: string | null) => void;
  getActiveRoom: () => Room | undefined;

  // Player management
  addPlayer: (roomId: string, playerName: string) => void;
  removePlayer: (roomId: string, playerId: string) => void;

  // Round / Scoring
  addRound: (roomId: string, scores: RoundScore[]) => void;
  deleteRound: (roomId: string, roundId: string) => void;

  // Override total score
  overrideTotalScore: (
    roomId: string,
    playerId: string,
    newTotal: number,
    note?: string
  ) => void;

  // Expected total
  updateExpectedTotal: (roomId: string, expectedTotal: number | null) => void;

  // Sort
  toggleSortDirection: (roomId: string) => void;
  getSortedPlayers: (roomId: string) => Player[];
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      rooms: [],
      activeRoomId: null,

      createRoom: (name: string, hostName: string, expectedTotal?: number | null) => {
        const id = generateId();
        const newRoom: Room = {
          id,
          name: name.trim(),
          hostName,
          players: [],
          rounds: [],
          createdAt: new Date().toISOString(),
          sortDirection: "desc",
          expectedTotal: expectedTotal ?? null,
        };
        set((state) => ({
          rooms: [newRoom, ...state.rooms],
          activeRoomId: id,
        }));
        return id;
      },

      deleteRoom: (roomId: string) => {
        set((state) => ({
          rooms: state.rooms.filter((r) => r.id !== roomId),
          activeRoomId:
            state.activeRoomId === roomId ? null : state.activeRoomId,
        }));
      },

      setActiveRoom: (roomId: string | null) => {
        set({ activeRoomId: roomId });
      },

      getActiveRoom: () => {
        const { rooms, activeRoomId } = get();
        return rooms.find((r) => r.id === activeRoomId);
      },

      addPlayer: (roomId: string, playerName: string) => {
        set((state) => ({
          rooms: state.rooms.map((room) => {
            if (room.id !== roomId) return room;
            const newPlayer: Player = {
              id: generateId(),
              name: playerName.trim(),
              totalScore: 0,
              isManuallyAdjusted: false,
            };
            return { ...room, players: [...room.players, newPlayer] };
          }),
        }));
      },

      removePlayer: (roomId: string, playerId: string) => {
        set((state) => ({
          rooms: state.rooms.map((room) => {
            if (room.id !== roomId) return room;
            return {
              ...room,
              players: room.players.filter((p) => p.id !== playerId),
              rounds: room.rounds.map((round) => ({
                ...round,
                scores: round.scores.filter((s) => s.playerId !== playerId),
              })),
            };
          }),
        }));
      },

      addRound: (roomId: string, scores: RoundScore[]) => {
        set((state) => ({
          rooms: state.rooms.map((room) => {
            if (room.id !== roomId) return room;
            const newRound: Round = {
              id: generateId(),
              roundNumber: room.rounds.length + 1,
              scores,
              createdAt: new Date().toISOString(),
            };
            // Recalculate totals from ALL rounds
            const allRounds = [...room.rounds, newRound];
            const updatedPlayers = room.players.map((player) => {
              if (player.isManuallyAdjusted) return player; // Don't override manual adjustments
              const total = allRounds.reduce((sum, round) => {
                const roundScore = round.scores.find(
                  (s) => s.playerId === player.id
                );
                return sum + (roundScore?.score ?? 0);
              }, 0);
              return { ...player, totalScore: total };
            });
            return {
              ...room,
              rounds: allRounds,
              players: updatedPlayers,
            };
          }),
        }));
      },

      deleteRound: (roomId: string, roundId: string) => {
        set((state) => ({
          rooms: state.rooms.map((room) => {
            if (room.id !== roomId) return room;
            const filteredRounds = room.rounds.filter(
              (r) => r.id !== roundId
            );
            // Recalculate totals
            const updatedPlayers = room.players.map((player) => {
              if (player.isManuallyAdjusted) return player;
              const total = filteredRounds.reduce((sum, round) => {
                const roundScore = round.scores.find(
                  (s) => s.playerId === player.id
                );
                return sum + (roundScore?.score ?? 0);
              }, 0);
              return { ...player, totalScore: total };
            });
            // Re-number rounds
            const renumberedRounds = filteredRounds.map((r, i) => ({
              ...r,
              roundNumber: i + 1,
            }));
            return {
              ...room,
              rounds: renumberedRounds,
              players: updatedPlayers,
            };
          }),
        }));
      },

      overrideTotalScore: (
        roomId: string,
        playerId: string,
        newTotal: number,
        note?: string
      ) => {
        set((state) => ({
          rooms: state.rooms.map((room) => {
            if (room.id !== roomId) return room;
            return {
              ...room,
              players: room.players.map((player) => {
                if (player.id !== playerId) return player;
                return {
                  ...player,
                  totalScore: newTotal,
                  isManuallyAdjusted: true,
                  adjustmentNote: note || "Sửa tay",
                };
              }),
            };
          }),
        }));
      },

      updateExpectedTotal: (roomId: string, expectedTotal: number | null) => {
        set((state) => ({
          rooms: state.rooms.map((room) => {
            if (room.id !== roomId) return room;
            return { ...room, expectedTotal };
          }),
        }));
      },

      toggleSortDirection: (roomId: string) => {
        set((state) => ({
          rooms: state.rooms.map((room) => {
            if (room.id !== roomId) return room;
            return {
              ...room,
              sortDirection: room.sortDirection === "desc" ? "asc" : "desc",
            };
          }),
        }));
      },

      getSortedPlayers: (roomId: string) => {
        const room = get().rooms.find((r) => r.id === roomId);
        if (!room) return [];
        const sorted = [...room.players].sort((a, b) => {
          return room.sortDirection === "desc"
            ? b.totalScore - a.totalScore
            : a.totalScore - b.totalScore;
        });
        return sorted;
      },
    }),
    {
      name: "scorex-rooms",
    }
  )
);
