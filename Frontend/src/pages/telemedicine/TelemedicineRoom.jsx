import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiVideo,
  FiVideoOff,
  FiMic,
  FiMicOff,
  FiPhoneOff,
  FiShare2,
  FiUser,
  FiFileText,
  FiMaximize2,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiActivity,
  FiAlertCircle,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import {
  getTelemedicineRoom,
  sendTelemedicineSignal,
  endTelemedicineConsultation,
} from "../../api/telemedicineApi";
import { sendWhatsAppNotification } from "../../api/notificationApi";
import useSEO from "../../hooks/useSEO";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

const TelemedicineRoom = () => {
  const { roomId } = useParams();

  useSEO({
    title: `Telemedicine Consultation (${roomId || "Virtual Room"})`,
    description: "Secure WebRTC peer-to-peer virtual consultation room with live EHR notes documentation.",
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const isDoctorOrAdmin = user?.role === "Doctor" || user?.role === "Admin";

  // Media state
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Connection & Room state
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [peerConnected, setPeerConnected] = useState(false);
  const [peerInfo, setPeerInfo] = useState(null);
  const [callEnded, setCallEnded] = useState(false);

  // In-Call Doctor Notes Drawer
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [bp, setBp] = useState("");
  const [pulse, setPulse] = useState("");
  const [temp, setTemp] = useState("");
  const [medsList, setMedsList] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const eventSourceRef = useRef(null);
  const clientIdRef = useRef(`client-${Date.now()}`);

  // 1. Fetch Room & Patient Details
  useEffect(() => {
    let timer = null;
    const fetchRoom = async () => {
      try {
        const res = await getTelemedicineRoom(roomId);
        setRoomData(res.data);
        if (res.data.appointment) {
          const appt = res.data.appointment;
          setClinicalNotes(appt.notes || "");
          const latestHistory = appt.patient?.medicalHistory?.slice(-1)[0];
          if (latestHistory?.vitals) {
            setBp(latestHistory.vitals.bp || "");
            setPulse(latestHistory.vitals.pulse || "");
            setTemp(latestHistory.vitals.temp || "");
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load consultation room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();

    // Call Duration Counter
    timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [roomId]);

  // 2. Initialize WebRTC Media Streams & Peer Connection
  useEffect(() => {
    let stream = null;

    const initMedia = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        createPeerConnection(stream);
      } catch (err) {
        console.warn("Could not access camera/microphone:", err.message);
        // Still allow peer connection even if video preview is blocked
        createPeerConnection(null);
      }
    };

    initMedia();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [roomId]);

  // 3. WebRTC Peer Connection Setup
  const createPeerConnection = (stream) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    // When remote stream arrives
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
        setPeerConnected(true);
      }
    };

    // When local ICE candidate is generated, dispatch via signaling API
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendTelemedicineSignal(roomId, {
          signalType: "ice-candidate",
          payload: event.candidate,
          senderId: clientIdRef.current,
        }).catch((e) => console.error("ICE dispatch error:", e));
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setPeerConnected(true);
      } else if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        setPeerConnected(false);
      }
    };

    // Start SSE Signaling Stream
    initSignaling(pc);
  };

  // 4. Server-Sent Events (SSE) Signaling
  const initSignaling = (pc) => {
    // In dev mode with cookie auth, EventSource receives cookies automatically
    const sseUrl = `/api/telemedicine/room/${roomId}/events`;
    const es = new EventSource(sseUrl, { withCredentials: true });
    eventSourceRef.current = es;

    es.addEventListener("connected", (e) => {
      const data = JSON.parse(e.data);
      clientIdRef.current = data.clientId;
    });

    es.addEventListener("peer-joined", async (e) => {
      const data = JSON.parse(e.data);
      setPeerInfo(data);
      // As doctor/admin or initiator, create and send WebRTC offer
      if (isDoctorOrAdmin) {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          await sendTelemedicineSignal(roomId, {
            signalType: "offer",
            payload: offer,
            senderId: clientIdRef.current,
          });
        } catch (err) {
          console.error("Error creating offer:", err);
        }
      }
    });

    es.addEventListener("signal", async (e) => {
      const data = JSON.parse(e.data);
      if (data.senderId === clientIdRef.current) return;

      const { signalType, payload } = data;

      try {
        if (signalType === "offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await sendTelemedicineSignal(roomId, {
            signalType: "answer",
            payload: answer,
            senderId: clientIdRef.current,
          });
        } else if (signalType === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
        } else if (signalType === "ice-candidate") {
          if (payload) {
            await pc.addIceCandidate(new RTCIceCandidate(payload));
          }
        }
      } catch (err) {
        console.error("Error handling signal:", err);
      }
    });

    es.addEventListener("peer-left", () => {
      setPeerConnected(false);
      setRemoteStream(null);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    });

    es.addEventListener("room-ended", () => {
      setCallEnded(true);
    });
  };

  // 5. Media Control Toggles
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (peerConnectionRef.current) {
          const senders = peerConnectionRef.current.getSenders();
          const sender = senders.find((s) => s.track && s.track.kind === "video");
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          stopScreenSharing();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.warn("Screen share cancelled:", err.message);
      }
    } else {
      stopScreenSharing();
    }
  };

  const stopScreenSharing = () => {
    if (localStream && peerConnectionRef.current) {
      const videoTrack = localStream.getVideoTracks()[0];
      const senders = peerConnectionRef.current.getSenders();
      const sender = senders.find((s) => s.track && s.track.kind === "video");
      if (sender && videoTrack) {
        sender.replaceTrack(videoTrack);
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
    }
    setIsScreenSharing(false);
  };

  // 6. Share Video Call via WhatsApp
  const handleShareWhatsApp = async () => {
    const patient = roomData?.appointment?.patient;
    const patientPhone = patient?.phone || "03001234567";
    const meetingUrl = window.location.href;

    try {
      const res = await sendWhatsAppNotification({
        phone: patientPhone,
        type: "appointment",
        data: {
          patientName: patient?.fullName || "Patient",
          doctorName: user?.name ? `Dr. ${user.name}` : "Your Doctor",
          dateStr: "Today",
          timeStr: "Now (Live Video Consultation)",
          meetingLink: meetingUrl,
          phone: patientPhone,
        },
      });

      if (res.data?.whatsAppLink) {
        window.open(res.data.whatsAppLink, "_blank");
      }
    } catch (err) {
      alert("Failed to generate WhatsApp invite: " + err.message);
    }
  };

  // 7. Conclude Consultation
  const handleEndCall = async () => {
    setSavingNotes(true);
    try {
      const medsArray = medsList
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => ({ name: line }));

      await endTelemedicineConsultation(roomId, {
        clinicalNotes,
        vitals: { bp, pulse, temp },
        prescription: medsArray,
      });

      setSavedSuccess(true);
      setTimeout(() => {
        navigate("/appointments");
      }, 1500);
    } catch (err) {
      alert("Error concluding consultation: " + (err.response?.data?.message || err.message));
    } finally {
      setSavingNotes(false);
    }
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500 mb-4" />
        <p className="text-sm font-medium text-slate-400">Connecting to Telemedicine Suite...</p>
      </div>
    );
  }

  if (callEnded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
          <FiCheckCircle size={36} />
        </div>
        <h2 className="text-xl font-bold">Consultation Concluded</h2>
        <p className="mt-2 text-sm text-slate-400 max-w-md">
          This virtual video consultation has ended. Clinical notes and records have been synchronized to the patient EHR.
        </p>
        <Link
          to="/appointments"
          className="mt-6 rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition"
        >
          Return to Appointments
        </Link>
      </div>
    );
  }

  const patient = roomData?.appointment?.patient;

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-white">
      {/* Main Video Stage */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Top Floating Room Bar */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-slate-900/80 px-4 py-2 backdrop-blur-md border border-slate-800 shadow-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600/30 text-purple-400">
              <FiVideo size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-bold text-slate-200">
                  SmartClinic Telemedicine Suite
                </h1>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                  Encrypted WebRTC P2P
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Patient: <span className="font-semibold text-white">{patient?.fullName || "Virtual Guest"}</span>
                {patient?.patientId && ` (${patient.patientId})`}
              </p>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900/80 px-3.5 py-2 backdrop-blur-md border border-slate-800 text-xs font-mono text-slate-300">
              <FiClock size={14} className="text-purple-400" />
              <span>{formatTimer(callDuration)}</span>
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 backdrop-blur-md transition"
              title="Send direct meeting link to patient's WhatsApp"
            >
              <FiShare2 size={13} /> Invite via WhatsApp
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
          {/* Remote Video (Full Stage) */}
          <div className="relative h-full w-full max-h-[82vh] overflow-hidden rounded-3xl bg-slate-900 border border-slate-800/80 shadow-2xl flex items-center justify-center">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-950/60 border border-purple-800/40 text-purple-400 mb-4 animate-pulse">
                  <FiUser size={38} />
                </div>
                <h3 className="text-base font-bold text-slate-200">
                  Waiting for patient to join...
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm">
                  Share the link with the patient via WhatsApp so they can enter the consultation from their phone or laptop.
                </p>
                <button
                  onClick={handleShareWhatsApp}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition"
                >
                  <FiSend size={13} /> Send WhatsApp Invite
                </button>
              </div>
            )}

            {/* Remote Participant Label */}
            {peerConnected && (
              <div className="absolute bottom-4 left-4 rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur-sm text-xs font-medium text-slate-200 border border-white/10">
                {peerInfo?.name || patient?.fullName || "Remote Participant"}
              </div>
            )}
          </div>

          {/* Picture-in-Picture Local Self Preview */}
          <div className="absolute bottom-24 right-8 z-30 h-44 w-60 overflow-hidden rounded-2xl bg-slate-900 border-2 border-purple-500/50 shadow-2xl transition hover:scale-105">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover -scale-x-100"
            />
            {isVideoOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-500">
                <FiVideoOff size={24} />
              </div>
            )}
            <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
              You ({user?.name || "Self"}) {isMicMuted && "(Muted)"}
            </div>
          </div>
        </div>

        {/* Bottom Call Action Dock */}
        <div className="relative z-20 flex h-20 items-center justify-center gap-3 bg-slate-950/90 border-t border-slate-800/80 px-6 backdrop-blur-md">
          {/* Mic Mute */}
          <button
            onClick={toggleMic}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition shadow-lg ${
              isMicMuted
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
            title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
          >
            {isMicMuted ? <FiMicOff size={18} /> : <FiMic size={18} />}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={toggleVideo}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition shadow-lg ${
              isVideoOff
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
            title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
          >
            {isVideoOff ? <FiVideoOff size={18} /> : <FiVideo size={18} />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition shadow-lg ${
              isScreenSharing
                ? "bg-purple-600 text-white"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
            title="Share Screen"
          >
            <FiMaximize2 size={18} />
          </button>

          {/* Clinical Notes Toggle (Doctors) */}
          {isDoctorOrAdmin && (
            <button
              onClick={() => setIsNotesOpen(!isNotesOpen)}
              className={`flex items-center gap-2 rounded-2xl px-4 h-12 font-semibold text-xs transition shadow-lg ${
                isNotesOpen
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <FiFileText size={16} />
              <span>{isNotesOpen ? "Hide EHR Notes" : "Open EHR Notes"}</span>
            </button>
          )}

          {/* End Call */}
          <button
            onClick={handleEndCall}
            disabled={savingNotes}
            className="flex items-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 px-5 h-12 font-bold text-xs text-white shadow-lg shadow-red-600/30 transition disabled:opacity-50"
          >
            <FiPhoneOff size={16} />
            <span>{savingNotes ? "Saving..." : "End Consultation"}</span>
          </button>
        </div>
      </div>

      {/* In-Call Doctor Consultation & Clinical Notes Side-Drawer */}
      {isDoctorOrAdmin && isNotesOpen && (
        <div className="relative z-30 flex h-full w-96 flex-col border-l border-slate-800 bg-slate-900/95 p-5 backdrop-blur-xl shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <FiActivity className="text-purple-400" size={18} />
              <h2 className="text-sm font-bold text-slate-100">Live EHR Consultation</h2>
            </div>
            <button
              onClick={() => setIsNotesOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <FiChevronRight size={18} />
            </button>
          </div>

          {/* Patient Quick Vitals & Identity */}
          {patient && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 mb-4 text-xs">
              <p className="font-bold text-white text-sm">{patient.fullName}</p>
              <p className="text-slate-400">
                {patient.gender} · {patient.age || "N/A"} yrs · Blood: {patient.bloodGroup || "N/A"}
              </p>
              <p className="text-slate-400 mt-0.5">Phone: {patient.phone}</p>
            </div>
          )}

          {/* Vitals Recording */}
          <div className="space-y-3 mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Vitals Recording
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Blood Pressure</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Pulse (bpm)</label>
                <input
                  type="text"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  placeholder="76"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Temp (°F)</label>
                <input
                  type="text"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  placeholder="98.6"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Doctor Clinical Notes */}
          <div className="space-y-1.5 mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Doctor Clinical Assessment
            </label>
            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Record chief complaint, diagnosis, and patient symptoms during call..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-purple-500 placeholder:text-slate-600 resize-none"
            />
          </div>

          {/* Medication Recommendations */}
          <div className="space-y-1.5 mb-6 flex-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Prescription (1 per line)
            </label>
            <textarea
              rows={3}
              value={medsList}
              onChange={(e) => setMedsList(e.target.value)}
              placeholder="e.g. Panadol 500mg - 1 tab TDS&#10;Amoxicillin 500mg - 1 cap BD"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none focus:border-purple-500 placeholder:text-slate-600 resize-none font-mono"
            />
          </div>

          {/* Save & Synchronize Button */}
          <button
            onClick={handleEndCall}
            disabled={savingNotes}
            className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 py-3 text-xs font-bold text-white shadow-lg shadow-purple-600/20 transition disabled:opacity-50"
          >
            {savedSuccess ? "Saved to EHR! Exiting..." : "Conclude & Save to EHR"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TelemedicineRoom;
