import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useRoomStore } from "@/store/useRoomStore";
import {
  Plus,
  ChevronRight,
  Trash2,
  LogOut,
  Sparkles,
  Users,
  Hash,
  Calculator,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Dashboard() {
  const navigate = useNavigate();
  const hostName = useAuthStore((s) => s.hostName);
  const logout = useAuthStore((s) => s.logout);
  const rooms = useRoomStore((s) => s.rooms);
  const createRoom = useRoomStore((s) => s.createRoom);
  const deleteRoom = useRoomStore((s) => s.deleteRoom);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newExpectedTotal, setNewExpectedTotal] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreateRoom = () => {
    if (!newRoomName.trim() || !hostName) return;
    const expectedTotal = newExpectedTotal.trim() ? Number(newExpectedTotal) : null;
    const id = createRoom(newRoomName, hostName, expectedTotal);
    setNewRoomName("");
    setNewExpectedTotal("");
    setShowCreateModal(false);
    navigate(`/room/${id}`);
  };

  const handleDeleteRoom = (roomId: string) => {
    setDeletingId(roomId);
    setTimeout(() => {
      deleteRoom(roomId);
      setDeletingId(null);
    }, 300);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-dvh" style={{ background: "#f8f9fc" }}>
      {/* Top Nav */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          background: "rgba(255,255,255,0.85)",
          borderColor: "var(--border-default)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: "var(--stripe-purple)" }}
            >
              <Sparkles className="h-4 w-4 text-white" strokeWidth={1.5} />
            </div>
            <span
              className="text-[15px] font-normal tracking-[-0.3px]"
              style={{ color: "var(--deep-navy)" }}
            >
              ScoreX
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="text-[13px] font-light"
              style={{ color: "var(--body-slate)" }}
            >
              {hostName}
            </span>
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" style={{ color: "var(--body-slate)" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-lg px-4 pb-24 pt-6">
        {/* Page heading */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1
              className="text-[1.65rem] leading-tight tracking-[-0.6px]"
              style={{ color: "var(--deep-navy)" }}
            >
              Các bàn chơi
            </h1>
            <p
              className="mt-1 text-[0.8125rem] font-light"
              style={{ color: "var(--body-slate)" }}
            >
              {rooms.length === 0
                ? "Chưa có bàn nào. Tạo bàn mới để bắt đầu!"
                : `${rooms.length} bàn`}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex h-9 items-center gap-1.5 rounded-[4px] px-3.5 text-[14px] font-normal text-white transition-all duration-200"
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
            Tạo bàn
          </button>
        </div>

        {/* Room list */}
        {rooms.length === 0 ? (
          <div
            className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16"
            style={{ borderColor: "var(--stripe-purple-light)" }}
          >
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
              style={{ background: "rgba(83,58,253,0.06)" }}
            >
              <Hash
                className="h-6 w-6"
                style={{ color: "var(--stripe-purple)" }}
                strokeWidth={1.5}
              />
            </div>
            <p
              className="text-[15px] font-light"
              style={{ color: "var(--body-slate)" }}
            >
              Bấm{" "}
              <span style={{ color: "var(--stripe-purple)" }}>
                "Tạo bàn"
              </span>{" "}
              để bắt đầu
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className="group animate-slide-up cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-stripe-2"
                style={{
                  borderColor: "var(--border-default)",
                  background: "#fff",
                  animationDelay: `${index * 60}ms`,
                  opacity: deletingId === room.id ? 0 : undefined,
                  transform:
                    deletingId === room.id
                      ? "translateX(40px) scale(0.95)"
                      : undefined,
                  transition:
                    "opacity 0.3s, transform 0.3s, box-shadow 0.2s",
                }}
                onClick={() => navigate(`/room/${room.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h3
                      className="truncate text-[15px] font-normal tracking-[-0.2px]"
                      style={{ color: "var(--deep-navy)" }}
                    >
                      {room.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span
                        className="flex items-center gap-1 text-[12px] font-light"
                        style={{ color: "var(--body-slate)" }}
                      >
                        <Users className="h-3 w-3" />
                        {room.players.length} người
                      </span>
                      <span
                        className="flex items-center gap-1 text-[12px] font-light"
                        style={{ color: "var(--body-slate)" }}
                      >
                        <Hash className="h-3 w-3" />
                        {room.rounds.length} ván
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoom(room.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-md opacity-0 transition-all hover:bg-red-50 group-hover:opacity-100"
                      title="Xóa bàn"
                    >
                      <Trash2
                        className="h-3.5 w-3.5"
                        style={{ color: "var(--ruby)" }}
                      />
                    </button>
                    <ChevronRight
                      className="h-4 w-4"
                      style={{ color: "var(--body-slate)" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Room Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle
              className="text-[1rem] tracking-[-0.2px]"
              style={{ color: "var(--deep-navy)" }}
            >
              Tạo bàn chơi mới
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateRoom();
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="room-name"
                className="mb-1.5 block text-[13px] font-normal"
                style={{ color: "var(--dark-slate)" }}
              >
                Tên bàn chơi
              </label>
              <input
                id="room-name"
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="VD: Tiến lên, Uno, Poker..."
                autoFocus
                autoComplete="off"
                className="h-10 w-full rounded-[4px] border px-3 text-[15px] font-light outline-none transition-all duration-200 placeholder:text-[#a0aec0]"
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

            <div>
              <label
                htmlFor="expected-total"
                className="mb-1.5 flex items-center gap-1.5 text-[13px] font-normal"
                style={{ color: "var(--dark-slate)" }}
              >
                <Calculator className="h-3.5 w-3.5" style={{ color: "var(--stripe-purple)" }} />
                Tổng điểm mỗi ván
                <span className="text-[11px] font-light" style={{ color: "var(--body-slate)" }}>(tùy chọn)</span>
              </label>
              <input
                id="expected-total"
                type="number"
                value={newExpectedTotal}
                onChange={(e) => setNewExpectedTotal(e.target.value)}
                placeholder="VD: 0, 100, ...để trống nếu không cần"
                autoComplete="off"
                className="h-10 w-full rounded-[4px] border px-3 text-[15px] font-light outline-none transition-all duration-200 placeholder:text-[#a0aec0]"
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
              <p className="mt-1 text-[11px] font-light" style={{ color: "var(--body-slate)" }}>
                Nếu nhập, tổng điểm các người chơi mỗi ván phải bằng số này
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
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
                disabled={!newRoomName.trim()}
                className="h-9 rounded-[4px] px-4 text-[14px] font-normal text-white transition-all disabled:opacity-40"
                style={{
                  background: newRoomName.trim()
                    ? "var(--stripe-purple)"
                    : "#c4c4e8",
                }}
              >
                Tạo bàn
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
