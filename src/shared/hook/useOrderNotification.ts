'use client'
import { useState, useEffect, useRef } from "react";
import { message } from "antd";
import { GET } from "@/util/apicall";
import API from "@/config/API_ADMIN";

interface Order {
  id: string;
  [key: string]: any;
}

interface ExtendedAudioElement extends HTMLAudioElement {
  onStopCallback?: () => void;
}

interface UseOrderNotificationProps {
  onNewOrder?: (order: Order) => void;
}

export default function useOrderNotification({ onNewOrder }: UseOrderNotificationProps = {}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newOrder, setNewOrder] = useState<Order | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  
  // Audio refs
  const isAudioPlaying = useRef<boolean>(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const activeAudioRef = useRef<ExtendedAudioElement | null>(null);
  const shouldStopAudio = useRef<boolean>(false);
  
  // Explicitly handle play with promise tracking
  const safePlayAudio = async (audio: HTMLAudioElement) => {
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch (e) {
        console.log("Previous play promise failed:", e);
      }
    }
    
    if (shouldStopAudio.current) {
      console.log("Audio play aborted because stop was requested");
      return;
    }
  
    audio.currentTime = 0;
    isAudioPlaying.current = true;
    
    try {
      playPromiseRef.current = audio.play();
      await playPromiseRef.current;
    } catch (error) {
      console.error("Audio play failed:", error);
      isAudioPlaying.current = false;
    } finally {
      playPromiseRef.current = null;
    }
  };
  
  const safePauseAudio = async (audio: HTMLAudioElement) => {
    shouldStopAudio.current = true;
    
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch (e) {
        console.log("Play promise failed during pause attempt:", e);
      } finally {
        playPromiseRef.current = null;
      }
    }
    
    if (isAudioPlaying.current) {
      audio.pause();
      audio.currentTime = 0;
      isAudioPlaying.current = false;
      console.log("Audio paused safely");
    }
  };
  
  const startNotificationSound = async () => {
    console.log("Starting notification sound");
    
    shouldStopAudio.current = false;
    
    if (activeAudioRef.current) {
      await safePauseAudio(activeAudioRef.current);
    }
    
    if (shouldStopAudio.current) {
      console.log("Audio start aborted because stop was requested during cleanup");
      return;
    }
    
    const audio = new Audio("/sounds/notification.mp3") as ExtendedAudioElement;
    audio.loop = true;
    audio.volume = 1.0;
    activeAudioRef.current = audio;
    
    await safePlayAudio(audio);
    
    const handleEnded = () => {
      if (isAudioPlaying.current && !shouldStopAudio.current && activeAudioRef.current === audio) {
        safePlayAudio(audio).catch(e => console.error("Loop play failed:", e));
      }
    };
    
    audio.addEventListener('ended', handleEnded);
    
    const onStopCallback = () => {
      audio.removeEventListener('ended', handleEnded);
    };
    
    audio.onStopCallback = onStopCallback;
  };
  
  const stopNotificationSound = async () => {
    console.log("Stopping notification sound", new Date().toISOString());
    
    shouldStopAudio.current = true;
    
    if (activeAudioRef.current) {
      if (activeAudioRef.current.onStopCallback) {
        activeAudioRef.current.onStopCallback();
      }
      
      await safePauseAudio(activeAudioRef.current);
      activeAudioRef.current = null;
    } else {
      console.log("No active audio to stop");
    }
  };
  
  const testAudioManually = async () => {
    message.info("Testing audio playback...");
    
    const testAudio = new Audio("/sounds/notification.mp3");
    testAudio.volume = 1.0;
    testAudio.loop = false;
    
    try {
      await safePlayAudio(testAudio);
      message.success("Audio test successful! If you don't hear anything, check your system volume.");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      message.error(`Audio test failed: ${errorMessage}`);
      console.error("Test audio error:", error);
    }
  };

  const handleModalOk = async () => {
    console.log("Modal OK clicked, stopping sound and closing modal", new Date().toISOString());
    await stopNotificationSound();
    setModalVisible(false);
  };

  useEffect(() => {
    const checkNewOrders = async () => {
      try {
        // Order APIs not available in Swagger - functionality disabled
        const latestOrders: { data: Order[] } = { data: [] };

        if (
          latestOrders?.data &&
          Array.isArray(latestOrders.data) &&
          latestOrders.data.length > 0
        ) {
          const latestOrderDetails = latestOrders.data[0];
          const latestOrderId = latestOrderDetails.id;

          if (lastOrderId && latestOrderId !== lastOrderId) {
            console.log("New order detected, showing modal and playing sound", new Date().toISOString());
            
            setNewOrder(latestOrderDetails);
            setModalVisible(true);
            
            if (onNewOrder && typeof onNewOrder === 'function') {
              onNewOrder(latestOrderDetails);
            }
            
            const hasInteracted = document.documentElement.hasAttribute('data-user-interacted');
            if (hasInteracted) {
              setTimeout(() => {
                startNotificationSound();
              }, 100);
            } else {
              console.log("No user interaction detected, cannot autoplay audio");
              setTimeout(() => {
                startNotificationSound();
              }, 100);
            }
          }

          setLastOrderId(latestOrderId); // Update the last order ID
        }
      } catch (error) {
        console.error("Error checking for new orders:", error);
      }
    };

    if (!lastOrderId) {
      // Initial fetch to get the latest order ID
      // Order APIs not available in Swagger - functionality disabled
      Promise.resolve({ data: [] as Order[] }).then(result => {
        if (
          result?.data &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          setLastOrderId(result.data[0].id);
        }
      }).catch(error => {
        console.error("Error fetching initial order ID:", error);
      });
    }

    const interval = setInterval(checkNewOrders, 5000);
    
    const markUserInteraction = () => {
      document.documentElement.setAttribute('data-user-interacted', 'true');
      document.removeEventListener('click', markUserInteraction);
      document.removeEventListener('keydown', markUserInteraction);
    };
    
    document.addEventListener('click', markUserInteraction);
    document.addEventListener('keydown', markUserInteraction);
    
    return () => {
      clearInterval(interval);
      stopNotificationSound();
      document.removeEventListener('click', markUserInteraction);
      document.removeEventListener('keydown', markUserInteraction);
    };
  }, [lastOrderId, onNewOrder]);

  useEffect(() => {
    return () => {
      stopNotificationSound();
    };
  }, []);

  return {
    modalVisible,
    setModalVisible,
    newOrder,
    handleModalOk,
    testAudioManually,
    stopNotificationSound
  };
}