"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Phone, PhoneOff, X } from "lucide-react";
import { demoService } from "@/services/demoService";
import { CallService, type CallState } from "@/services/callService";

interface SmallCallButtonProps {
  commonAgentId: string;
  targetAgentId: string;
  language?: string;
  voice?: string;
  className?: string;
}

const SmallCallButton = ({
  commonAgentId,
  targetAgentId,
  language,
  voice,
  className = "",
}: SmallCallButtonProps) => {
  const callServiceRef = useRef<CallService | null>(null);

  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    room: null,
  });
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    if (!callServiceRef.current) {
      callServiceRef.current = new CallService();
    }
    return () => {
      if (callServiceRef.current) {
        callServiceRef.current.endCall();
      }
    };
  }, []);

  useEffect(() => {
    if (!callServiceRef.current) return;

    callServiceRef.current.setCallbacks({
      onStateChange: (newState) => {
        console.log("Button received state change:", newState);
        setCallState(newState);
      },
      onParticipantConnected: (participant) => {
        console.log("Agent connected:", participant.identity);
        setShowNotification("Agent joined the call!");
        setTimeout(() => setShowNotification(null), 3000);
      },
      onParticipantDisconnected: (participant) => {
        console.log("Agent disconnected:", participant.identity);
        setShowNotification("Agent left the call");
        setTimeout(() => setShowNotification(null), 3000);
      },
      onTrackSubscribed: (track, participant) => {
        console.log("Track received:", track.kind, "from", participant.identity);
        if (track.kind === "audio") {
          setShowNotification("Audio connected - you can hear the agent!");
          setTimeout(() => setShowNotification(null), 3000);
        }
      },
    });

    const initialState = callServiceRef.current.getCurrentState();
    console.log("Button initial state:", initialState);
    setCallState(initialState);

    return () => {
      if (callServiceRef.current) {
        callServiceRef.current.setCallbacks({});
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!callServiceRef.current) return;

      const currentState = callServiceRef.current.getCurrentState();
      setCallState((prevState) => {
        if (
          prevState.isConnected !== currentState.isConnected ||
          prevState.isConnecting !== currentState.isConnecting
        ) {
          console.log("Force updating button state:", currentState);
          return currentState;
        }
        return prevState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      clearCallTimer();
    };
  }, []);

  const startCallTimer = () => {
    const duration = 300; // 5 minutes
    setTimeRemaining(duration);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoEndCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    callTimerRef.current = timer;
  };

  const clearCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setTimeRemaining(0);
  };

  const handleAutoEndCall = async () => {
    try {
      if (callServiceRef.current) {
        await callServiceRef.current.endCall();
      }
      setShowNotification("Demo call ended (5 minute limit)");
      setTimeout(() => setShowNotification(null), 3000);
      clearCallTimer();
      setTimeout(() => {
        setShowSignupModal(true);
      }, 1200);
    } catch (error) {
      console.error("Error auto-ending call:", error);
    }
  };

  const handleCallClick = async () => {
    try {
      console.log("Button clicked, current state:", callState);

      if (callState.isConnected) {
        console.log("Ending call...");
        setShowNotification("Ending call...");
        if (callServiceRef.current) {
          await callServiceRef.current.endCall();
        }
        clearCallTimer();
        setShowNotification("Call ended");
        setTimeout(() => setShowNotification(null), 3000);
      } else {
        console.log("Starting demo call...");
        setShowNotification("Starting demo call...");
        setTimeout(() => setShowNotification(null), 2000);

        console.log("Making call with:", { voice, language });
        const response = await demoService.fetchDemoToken(
          commonAgentId,
          targetAgentId,
          voice || "Indus-hi-urvashi",
          demoService.getLanguageCode(language || "Hindi"),
          "",
          ""
        );

        let livekitUrl = response.host || response.ws_url;
        if (livekitUrl) {
          try {
            const url = new URL(livekitUrl);
            livekitUrl = `${url.protocol}//${url.host}`;
          } catch (e) {
            if (!livekitUrl.startsWith("wss://") && !livekitUrl.startsWith("ws://")) {
              livekitUrl = "wss://" + livekitUrl;
            }
          }
        }

        if (callServiceRef.current) {
          await callServiceRef.current.connectToCall(response.token, livekitUrl);
        }
        setShowNotification("Demo call connected! You have 5 minutes.");
        setTimeout(() => setShowNotification(null), 3000);

        startCallTimer();
      }
    } catch (error) {
      console.error("Call action failed:", error);
      setShowNotification("Call failed. Please try again.");
      setTimeout(() => setShowNotification(null), 3000);
      clearCallTimer();
    }
  };

  const getButtonContent = () => {
    console.log("Getting button content for state:", callState);
    if (callState.isConnecting) {
      return (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          Connecting...
        </>
      );
    }
    if (callState.isConnected) {
      if (timeRemaining > 0) {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        return (
          <>
            <PhoneOff className="h-3 w-3" />
            End Call ({minutes}:{seconds.toString().padStart(2, "0")})
          </>
        );
      }
      return (
        <>
          <PhoneOff className="h-3 w-3" />
          End Call
        </>
      );
    }
    return (
      <>
        <Phone className="h-3 w-3" />
        Call
      </>
    );
  };

  const getButtonClass = () => {
    const baseClass =
      "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 gap-2 shadow-sm hover:shadow-md transform hover:scale-105";

    if (callState.isConnecting) {
      return `${baseClass} bg-amber-500 text-white cursor-not-allowed animate-pulse border border-amber-400`;
    }

    if (callState.isConnected) {
      return `${baseClass} bg-rose-600 text-white hover:bg-rose-500 border border-rose-400 font-bold shadow-rose-500/25`;
    }

    return `${baseClass} bg-foreground text-background border border-foreground hover:bg-foreground/90`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCallClick}
        disabled={callState.isConnecting}
        className={`${getButtonClass()} ${className}`}
      >
        {getButtonContent()}
      </button>

      {showNotification && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-foreground px-4 py-2 text-xs text-background shadow-xl">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
            {showNotification}
          </div>
          <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-foreground"></div>
        </div>
      )}

      {callState.error && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-rose-400 bg-rose-600 px-4 py-2 text-xs text-white shadow-xl">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-200"></div>
            Error: {callState.error}
          </div>
          <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-rose-600"></div>
        </div>
      )}

      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 text-foreground shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSignupModal(false)}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:text-foreground"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Access Full Agents</h3>
                <p className="text-sm text-foreground/70">Unlock unlimited voice AI capabilities.</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-foreground/80">
              You have experienced the demo. Sign up or log in to access unlimited agent configurations, custom voices,
              and advanced features for your business needs.
            </p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  window.open("https://playground.induslabs.io/register", "_blank");
                  setShowSignupModal(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Sign Up Now
              </button>
              <button
                type="button"
                onClick={() => {
                  window.open("https://playground.induslabs.io/login", "_blank");
                  setShowSignupModal(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Already have an account? Log in
              </button>
              <button
                type="button"
                onClick={() => setShowSignupModal(false)}
                className="flex w-full items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground/70 transition hover:text-foreground"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmallCallButton;
