import React, { useState } from 'react';
import {
  RotateCcw,
  Download,
  Activity,
  Eye,
  AlertOctagon,
  X,
  Radio,
  Wifi,
} from 'lucide-react';

export default function AdminMeetingsTab({
  activeMeetings,
  onForceEndMeeting,
  onRefresh,
}) {
  const [inspectingRoom, setInspectingRoom] = useState(null);

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
        {/* Header & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base">
              Giám sát Hạ tầng WebRTC P2P Mesh
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Theo dõi trực tiếp các kết nối ngang hàng thời gian thực giữa các trình duyệt
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onRefresh}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Làm mới</span>
            </button>

            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mesh Topology Active</span>
            </span>
          </div>
        </div>

        {activeMeetings.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Hiện không có phòng họp WebRTC nào đang diễn ra.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {activeMeetings.map((room) => (
              <div
                key={room.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white text-base">{room.title}</div>
                    <div className="text-xs font-mono text-purple-400 mt-0.5">{room.id}</div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Người chủ trì (Host):</span>
                    <span className="font-semibold text-white">{room.host}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Số lượng kết nối Peer:</span>
                    <span className="font-semibold text-emerald-400">
                      {room.peersCount} thành viên
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Mạng ngang hàng & Độ trễ:</span>
                    <span className="font-mono text-slate-300">{room.network}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Thu âm MediaRecorder:</span>
                    <span className="font-bold text-rose-400">Đang ghi âm (WAV 16kHz)</span>
                  </div>
                </div>

                {/* Action Buttons on each meeting card */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => setInspectingRoom(room)}
                    className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>Chi tiết Mesh</span>
                  </button>

                  <button
                    onClick={() => onForceEndMeeting && onForceEndMeeting(room.id)}
                    className="py-2 rounded-xl bg-rose-950/80 border border-rose-600/40 text-rose-300 font-bold text-xs hover:bg-rose-900 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    <span>Đóng phòng</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inspect Peer Mesh Modal */}
      {inspectingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Chẩn đoán WebRTC P2P Mesh: {inspectingRoom.id}
                  </h3>
                  <p className="text-xs text-slate-400">{inspectingRoom.title}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectingRoom(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Topology: Full Mesh (N*(N-1)/2 Connections)</span>
                  <span className="text-emerald-400 font-mono">STUN Direct P2P</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Các luồng video/audio được truyền trực tiếp giữa các trình duyệt của sinh viên VKU không thông qua Media Server trung gian.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-slate-300">Danh sách kết nối Peer hiện tại:</div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span>Host: {inspectingRoom.host}</span>
                    <span className="text-emerald-400">RTT: 18ms · 0% loss</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span>Peer 2: Lê Quốc Cường (24AI009)</span>
                    <span className="text-emerald-400">RTT: 24ms · 0% loss</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span>Peer 3: Đỗ Quang Trung (24IT289)</span>
                    <span className="text-emerald-400">RTT: 21ms · 0% loss</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectingRoom(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
