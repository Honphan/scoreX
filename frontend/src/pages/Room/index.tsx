import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoomStore } from "@/store/useRoomStore";
import type { RoundScore } from "@/types";
import {
  ArrowLeft,
  Plus,
  Minus,
  UserPlus,
  Trophy,
  ArrowUpDown,
  Pencil,
  Trash2,
  X,
  Crown,
  ChevronDown,
  ChevronUp,
  Hash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ======================== SCORE STEPPER ========================
function ScoreStepper({
  playerName,
  value,
  onChange,
}: {
  playerName: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const quickValues = [1, 5, 10];

  return (
    <div
      className="rounded-lg border p-3"
      style={{ borderColor: "var(--border-default)", background: "#fff" }}
    >
      <p
        className="mb-2.5 text-[13px] font-normal tracking-[-0.1px]"
        style={{ color: "var(--deep-navy)" }}
      >
        {playerName}
      </p>
      <div className="flex items-center gap-2">
        {/* Decrease */}
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[4px] border transition-colors hover:bg-gray-50 active:scale-95"
          style={{ borderColor: "var(--border-default)" }}
        >
          <Minus className="h-3.5 w-3.5" style={{ color: "var(--deep-navy)" }} />
        </button>

        {/* Input */}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="h-9 w-full min-w-0 rounded-[4px] border px-2 text-center text-[15px] font-light outline-none transition-all text-tabular"
          style={{
            borderColor: "var(--border-default)",
            color: "var(--deep-navy)",
            fontFeatureSettings: '"tnum"',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--stripe-purple)";
            e.target.style.boxShadow = "0 0 0 3px rgba(83,58,253,0.12)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border-default)";
            e.target.style.boxShadow = "none";
          }}
        />

        {/* Increase */}
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[4px] border transition-colors hover:bg-gray-50 active:scale-95"
          style={{ borderColor: "var(--border-default)" }}
        >
          <Plus className="h-3.5 w-3.5" style={{ color: "var(--deep-navy)" }} />
        </button>
      </div>

      {/* Quick step buttons */}
      <div className="mt-2 flex gap-1.5">
        {quickValues.map((qv) => (
          <div key={qv} className="flex flex-1 gap-1">
            <button
              type="button"
              onClick={() => onChange(value - qv)}
              className="flex h-7 flex-1 items-center justify-center rounded-[4px] text-[11px] font-normal transition-colors hover:bg-red-50"
              style={{
                color: "var(--ruby)",
                background: "rgba(234,34,97,0.05)",
              }}
            >
              −{qv}
            </button>
            <button
              type="button"
              onClick={() => onChange(value + qv)}
              className="flex h-7 flex-1 items-center justify-center rounded-[4px] text-[11px] font-normal transition-colors hover:bg-green-50"
              style={{
                color: "var(--success-text)",
                background: "rgba(21,190,83,0.06)",
              }}
            >
              +{qv}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================== MAIN ROOM PAGE ========================
export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const rooms = useRoomStore((s) => s.rooms);
  const addPlayer = useRoomStore((s) => s.addPlayer);
  const removePlayer = useRoomStore((s) => s.removePlayer);
  const addRound = useRoomStore((s) => s.addRound);
  const deleteRound = useRoomStore((s) => s.deleteRound);
  const overrideTotalScore = useRoomStore((s) => s.overrideTotalScore);
  const toggleSortDirection = useRoomStore((s) => s.toggleSortDirection);
  const getSortedPlayers = useRoomStore((s) => s.getSortedPlayers);

  const room = rooms.find((r) => r.id === roomId);

  // Local UI states
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [showRoundInput, setShowRoundInput] = useState(false);
  const [roundScores, setRoundScores] = useState<Record<string, number>>({});
  const [showOverride, setShowOverride] = useState(false);
  const [overridePlayerId, setOverridePlayerId] = useState<string | null>(null);
  const [overrideValue, setOverrideValue] = useState(0);
  const [overrideNote, setOverrideNote] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const sortedPlayers = useMemo(() => {
    if (!roomId) return [];
    return getSortedPlayers(roomId);
  }, [roomId, room?.players, room?.sortDirection, getSortedPlayers]);

  if (!room || !roomId) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p style={{ color: "var(--body-slate)" }}>Bàn chơi không tồn tại.</p>
      </div>
    );
  }

  // ---- Add Player ----
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    addPlayer(roomId, newPlayerName);
    setNewPlayerName("");
    setShowAddPlayer(false);
  };

  // ---- Start New Round ----
  const handleStartRound = () => {
    const initial: Record<string, number> = {};
    room.players.forEach((p) => (initial[p.id] = 0));
    setRoundScores(initial);
    setShowRoundInput(true);
  };

  const handleConfirmRound = () => {
    const scores: RoundScore[] = room.players.map((p) => ({
      playerId: p.id,
      score: roundScores[p.id] || 0,
    }));
    addRound(roomId, scores);
    setShowRoundInput(false);
    setRoundScores({});
  };

  // ---- Override Score ----
  const handleOpenOverride = (playerId: string, currentTotal: number) => {
    setOverridePlayerId(playerId);
    setOverrideValue(currentTotal);
    setOverrideNote("");
    setShowOverride(true);
  };

  const handleConfirmOverride = () => {
    if (!overridePlayerId) return;
    overrideTotalScore(roomId, overridePlayerId, overrideValue, overrideNote);
    setShowOverride(false);
    setOverridePlayerId(null);
  };

  const getRankStyle = (index: number) => {
    if (index === 0)
      return {
        bg: "linear-gradient(135deg, rgba(83,58,253,0.06) 0%, rgba(249,107,238,0.04) 100%)",
        border: "var(--stripe-purple-light)",
        iconColor: "var(--stripe-purple)",
      };
    if (index === 1)
      return {
        bg: "#fff",
        border: "var(--border-default)",
        iconColor: "var(--body-slate)",
      };
    return {
      bg: "#fff",
      border: "var(--border-default)",
      iconColor: "var(--body-slate)",
    };
  };

  return (
    <div className="min-h-dvh" style={{ background: "#f8f9fc" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          background: "rgba(255,255,255,0.85)",
          borderColor: "var(--border-default)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" style={{ color: "var(--deep-navy)" }} />
            </button>
            <h2
              className="truncate text-[15px] font-normal tracking-[-0.2px]"
              style={{ color: "var(--deep-navy)" }}
            >
              {room.name}
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowAddPlayer(true)}
              className="add-player-btn flex h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.96]"
              style={{
                background: "linear-gradient(135deg, var(--stripe-purple) 0%, #7c5cfc 100%)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "linear-gradient(135deg, var(--stripe-purple-hover) 0%, #6a4beb 100%)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "linear-gradient(135deg, var(--stripe-purple) 0%, #7c5cfc 100%)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <UserPlus className="h-3.5 w-3.5" strokeWidth={2.2} />
              Thêm người
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pb-28 pt-5">
        {/* ===== LEADERBOARD ===== */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4" style={{ color: "var(--stripe-purple)" }} />
            <h3
              className="text-[15px] font-normal tracking-[-0.2px]"
              style={{ color: "var(--deep-navy)" }}
            >
              Bảng xếp hạng
            </h3>
          </div>
          {room.players.length > 1 && (
            <button
              onClick={() => toggleSortDirection(roomId)}
              className="flex items-center gap-1 rounded-[4px] px-2 py-1 text-[12px] font-normal transition-colors hover:bg-gray-100"
              style={{ color: "var(--body-slate)" }}
            >
              <ArrowUpDown className="h-3 w-3" />
              {room.sortDirection === "desc" ? "Cao → Thấp" : "Thấp → Cao"}
            </button>
          )}
        </div>

        {sortedPlayers.length === 0 ? (
          <button
            onClick={() => setShowAddPlayer(true)}
            className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed py-14 transition-all duration-200 hover:border-solid hover:shadow-sm"
            style={{
              borderColor: "var(--stripe-purple-light)",
              background: "linear-gradient(135deg, rgba(83,58,253,0.03) 0%, rgba(124,92,252,0.02) 100%)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--stripe-purple)";
              (e.currentTarget as HTMLElement).style.background =
                "linear-gradient(135deg, rgba(83,58,253,0.06) 0%, rgba(124,92,252,0.04) 100%)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--stripe-purple-light)";
              (e.currentTarget as HTMLElement).style.background =
                "linear-gradient(135deg, rgba(83,58,253,0.03) 0%, rgba(124,92,252,0.02) 100%)";
            }}
          >
            <div
              className="mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, var(--stripe-purple) 0%, #7c5cfc 100%)",
                boxShadow: "0 4px 14px rgba(83,58,253,0.25)",
              }}
            >
              <UserPlus className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <p
              className="text-[15px] font-medium tracking-[-0.2px]"
              style={{ color: "var(--stripe-purple)" }}
            >
              Thêm người chơi
            </p>
            <p className="mt-1 text-[13px] font-light" style={{ color: "var(--body-slate)" }}>
              Nhấn để thêm người chơi vào bàn
            </p>
          </button>
        ) : (
          <div className="space-y-2">
            {sortedPlayers.map((player, index) => {
              const rank = getRankStyle(index);
              return (
                <div
                  key={player.id}
                  className="animate-slide-up group flex items-center gap-3 rounded-lg border p-3 transition-all duration-200"
                  style={{
                    borderColor: rank.border,
                    background: rank.bg,
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Rank badge */}
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-normal"
                    style={{
                      background:
                        index === 0
                          ? "var(--stripe-purple)"
                          : index === 1
                          ? "var(--border-default)"
                          : "var(--border-default)",
                      color: index === 0 ? "#fff" : "var(--deep-navy)",
                    }}
                  >
                    {index === 0 ? (
                      <Crown className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Name */}
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-[14px] font-normal tracking-[-0.1px]"
                      style={{ color: "var(--deep-navy)" }}
                    >
                      {player.name}
                    </p>
                    {player.isManuallyAdjusted && (
                      <span
                        className="flex items-center gap-0.5 text-[10px] font-light"
                        style={{ color: "var(--lemon, #9b6829)" }}
                      >
                        <Pencil className="h-2.5 w-2.5" /> {player.adjustmentNote || "Sửa tay"}
                      </span>
                    )}
                  </div>

                  {/* Total score — click to override */}
                  <button
                    onClick={() => handleOpenOverride(player.id, player.totalScore)}
                    className="group/score flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-white/80"
                    title="Nhấn để sửa tổng điểm"
                  >
                    <span
                      className="text-[18px] font-normal tracking-[-0.4px] text-tabular"
                      style={{
                        color: "var(--deep-navy)",
                        fontFeatureSettings: '"tnum"',
                      }}
                    >
                      {player.totalScore}
                    </span>
                    <Pencil
                      className="h-3 w-3 opacity-0 transition-opacity group-hover/score:opacity-60"
                      style={{ color: "var(--body-slate)" }}
                    />
                  </button>

                  {/* Remove player */}
                  <button
                    onClick={() => removePlayer(roomId, player.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md opacity-0 transition-all hover:bg-red-50 group-hover:opacity-100"
                    title="Xóa người chơi"
                  >
                    <X className="h-3 w-3" style={{ color: "var(--ruby)" }} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== ROUND HISTORY ===== */}
        {room.rounds.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex w-full items-center justify-between py-2 text-[14px] font-normal transition-colors"
              style={{ color: "var(--dark-slate)" }}
            >
              <span className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5" style={{ color: "var(--stripe-purple)" }} />
                Lịch sử ván ({room.rounds.length})
              </span>
              {showHistory ? (
                <ChevronUp className="h-4 w-4" style={{ color: "var(--body-slate)" }} />
              ) : (
                <ChevronDown className="h-4 w-4" style={{ color: "var(--body-slate)" }} />
              )}
            </button>

            {showHistory && (
              <div className="mt-2 space-y-2">
                {room.rounds.map((round) => (
                  <div
                    key={round.id}
                    className="animate-fade-in group rounded-lg border p-3"
                    style={{
                      borderColor: "var(--border-default)",
                      background: "#fff",
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className="text-[12px] font-normal"
                        style={{ color: "var(--stripe-purple)" }}
                      >
                        Ván {round.roundNumber}
                      </span>
                      <button
                        onClick={() => deleteRound(roomId, round.id)}
                        className="flex h-6 w-6 items-center justify-center rounded opacity-0 transition-all hover:bg-red-50 group-hover:opacity-100"
                      >
                        <Trash2
                          className="h-3 w-3"
                          style={{ color: "var(--ruby)" }}
                        />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {round.scores.map((rs) => {
                        const player = room.players.find((p) => p.id === rs.playerId);
                        if (!player) return null;
                        return (
                          <div
                            key={rs.playerId}
                            className="flex items-center justify-between text-[13px]"
                          >
                            <span className="font-light" style={{ color: "var(--dark-slate)" }}>
                              {player.name}
                            </span>
                            <span
                              className="font-normal text-tabular"
                              style={{
                                color:
                                  rs.score > 0
                                    ? "var(--success-text)"
                                    : rs.score < 0
                                    ? "var(--ruby)"
                                    : "var(--body-slate)",
                                fontFeatureSettings: '"tnum"',
                              }}
                            >
                              {rs.score > 0 ? `+${rs.score}` : rs.score}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===== FLOATING ACTION BUTTON ===== */}
      {room.players.length >= 2 && (
        <div className="fixed bottom-6 left-0 right-0 z-30 flex justify-center px-4">
          <button
            onClick={handleStartRound}
            className="flex h-12 items-center gap-2 rounded-lg px-6 text-[15px] font-normal text-white shadow-stripe-3 transition-all duration-200 active:scale-[0.97]"
            style={{
              background: "var(--stripe-purple)",
              fontFeatureSettings: '"ss01"',
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.background =
                "var(--stripe-purple-hover)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.background =
                "var(--stripe-purple)")
            }
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nhập ván mới
          </button>
        </div>
      )}

      {/* ===== ADD PLAYER DIALOG ===== */}
      <Dialog open={showAddPlayer} onOpenChange={setShowAddPlayer}>
        <DialogContent className="sm:max-w-[340px]">
          <DialogHeader>
            <DialogTitle
              className="text-[1rem] tracking-[-0.2px]"
              style={{ color: "var(--deep-navy)" }}
            >
              Thêm người chơi
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPlayer();
            }}
          >
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Tên người chơi"
              autoFocus
              autoComplete="off"
              className="h-10 w-full rounded-[4px] border px-3 text-[15px] font-light outline-none transition-all placeholder:text-[#a0aec0]"
              style={{
                borderColor: "var(--border-default)",
                color: "var(--deep-navy)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--stripe-purple)";
                e.target.style.boxShadow = "0 0 0 3px rgba(83,58,253,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-default)";
                e.target.style.boxShadow = "none";
              }}
            />
            <DialogFooter className="mt-4 gap-2 sm:gap-2">
              <button
                type="button"
                onClick={() => setShowAddPlayer(false)}
                className="h-9 rounded-[4px] border px-4 text-[14px] font-normal transition-colors hover:bg-gray-50"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--dark-slate)",
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!newPlayerName.trim()}
                className="h-9 rounded-[4px] px-4 text-[14px] font-normal text-white transition-all disabled:opacity-40"
                style={{
                  background: newPlayerName.trim()
                    ? "var(--stripe-purple)"
                    : "#c4c4e8",
                }}
              >
                Thêm
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== ROUND INPUT DIALOG ===== */}
      <Dialog open={showRoundInput} onOpenChange={setShowRoundInput}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle
              className="text-[1rem] tracking-[-0.2px]"
              style={{ color: "var(--deep-navy)" }}
            >
              Ván {room.rounds.length + 1} – Nhập điểm
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {room.players.map((player) => (
              <ScoreStepper
                key={player.id}
                playerName={player.name}
                value={roundScores[player.id] || 0}
                onChange={(v) =>
                  setRoundScores((prev) => ({ ...prev, [player.id]: v }))
                }
              />
            ))}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowRoundInput(false)}
              className="h-9 rounded-[4px] border px-4 text-[14px] font-normal transition-colors hover:bg-gray-50"
              style={{
                borderColor: "var(--border-default)",
                color: "var(--dark-slate)",
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmRound}
              className="h-9 rounded-[4px] px-4 text-[14px] font-normal text-white transition-all"
              style={{ background: "var(--stripe-purple)" }}
            >
              Xác nhận
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== OVERRIDE SCORE DIALOG ===== */}
      <Dialog open={showOverride} onOpenChange={setShowOverride}>
        <DialogContent className="sm:max-w-[340px]">
          <DialogHeader>
            <DialogTitle
              className="text-[1rem] tracking-[-0.2px]"
              style={{ color: "var(--deep-navy)" }}
            >
              Sửa tổng điểm
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label
                className="mb-1.5 block text-[13px] font-normal"
                style={{ color: "var(--dark-slate)" }}
              >
                Tổng điểm mới
              </label>
              <input
                type="number"
                value={overrideValue}
                onChange={(e) => setOverrideValue(Number(e.target.value) || 0)}
                autoFocus
                className="h-10 w-full rounded-[4px] border px-3 text-center text-[18px] font-light outline-none transition-all text-tabular"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--deep-navy)",
                  fontFeatureSettings: '"tnum"',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--stripe-purple)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(83,58,253,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-default)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div>
              <label
                className="mb-1.5 block text-[13px] font-normal"
                style={{ color: "var(--dark-slate)" }}
              >
                Ghi chú (tùy chọn)
              </label>
              <input
                type="text"
                value={overrideNote}
                onChange={(e) => setOverrideNote(e.target.value)}
                placeholder="VD: Tính lại vì thiếu 5 điểm..."
                className="h-10 w-full rounded-[4px] border px-3 text-[14px] font-light outline-none transition-all placeholder:text-[#a0aec0]"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--deep-navy)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--stripe-purple)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(83,58,253,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-default)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowOverride(false)}
              className="h-9 rounded-[4px] border px-4 text-[14px] font-normal transition-colors hover:bg-gray-50"
              style={{
                borderColor: "var(--border-default)",
                color: "var(--dark-slate)",
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmOverride}
              className="h-9 rounded-[4px] px-4 text-[14px] font-normal text-white transition-all"
              style={{ background: "var(--stripe-purple)" }}
            >
              Cập nhật
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
