import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useConnect, Connector } from "wagmi";
import GlassmorphicCard from "@/components/GlassmorphicCard";
import CyberButton from "@/components/CyberButton";
import PageTransition from "@/components/PageTransition";
import AnimatedCheckmark from "@/components/AnimatedCheckmark";
import FloatingElements from "@/components/FloatingElements";
import ScoreDisplay from "@/components/ScoreDisplay";

const walletTasks: string[] = [
  "Checking DEX Trades & Interactions",
  "Analyzing NFT Flip Performance",
  "Measuring DeFi Exposure & Farming Activity",
  "Detecting Blue-Chip Token Holdings",
];

const WalletConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const { connect, connectors } = useConnect();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [taskStatus, setTaskStatus] = useState<boolean[]>(Array(walletTasks.length).fill(false));
  const [completedScan, setCompletedScan] = useState<boolean>(false);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const targetScore = 6750;

  // 🟢 Check if Wallet is already connected
  useEffect(() => {
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) {
      console.log("🔄 Wallet Found:", storedWallet);
      setWalletAddress(storedWallet);
      setWalletConnected(true);
    }
  }, []);

  // 🟢 Start handleConnect() animation if Wallet is already connected
  useEffect(() => {
    if (walletConnected && !isConnecting) {
      console.log("✅ Auto-starting handleConnect...");
      handleConnect();
    }
  }, [walletConnected]);

  // 🟢 Function to Connect Wallet via WalletConnect
  const connectWallet = async () => {
    try {
      const wcConnector: Connector | undefined = connectors.find((c) => c.id === "walletConnect");
      if (!wcConnector) {
        alert("WalletConnect is not available.");
        return;
      }

      const result = await connect({ connector: wcConnector });

      if (result?.data) {
        console.log("✅ Wallet Connected:", result.data.account);
        setWalletAddress(result.data.account);
        localStorage.setItem("walletAddress", result.data.account);
        setWalletConnected(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ WalletConnect Error:", err.message);
      }
    }
  };

  // 🟢 Function to Simulate Wallet Data Fetching & Scanning
  const handleConnect = () => {
    console.log("🚀 Starting handleConnect...");
    setIsConnecting(true);
    let currentTask = 0;

    const taskInterval = setInterval(() => {
      if (currentTask < walletTasks.length) {
        setTaskStatus((prev) => {
          const newStatus = [...prev];
          newStatus[currentTask] = true;
          return newStatus;
        });
        currentTask++;
      } else {
        clearInterval(taskInterval);
        setCompletedScan(true);

        let currentScore = 0;
        const scoreIncrement = Math.ceil(targetScore / 50);
        const scoreInterval = setInterval(() => {
          currentScore += scoreIncrement;
          if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(scoreInterval);

            // ✅ Navigate to Telegram Page after animation completes
            setTimeout(() => {
              navigate("/connect/telegram");
            }, 2000);
          }
          setScore(currentScore);
        }, 30);
      }
    }, 800);
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4">
        <FloatingElements type="wallets" count={25} />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-md">
          {/* Progress steps */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-2 mb-6"
          >
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-1 rounded-full ${i <= 2 ? "bg-cyber-green/70" : "bg-white/20"}`}
              />
            ))}
          </motion.div>

          <GlassmorphicCard className="w-full mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="w-12 h-12 rounded-full bg-cyber-pink/10 border border-cyber-pink/30 flex items-center justify-center">
                <Wallet size={24} className="text-cyber-pink" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2 text-white"
            >
              {walletConnected ? "Analyzing Your Wallet" : "Connect Your Wallet"}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/70 mb-6"
            >
              {walletConnected
                ? "Your on-chain activity defines your degen rank."
                : "Tap below to connect and verify your on-chain presence."}
            </motion.p>

            {/* Step 1: Show WalletConnect Button */}
            {!walletConnected && (
              <CyberButton
                onClick={connectWallet}
                className="w-full"
                variant="secondary"
                icon={<Wallet size={18} />}
              >
                Connect Wallet
              </CyberButton>
            )}

            {/* Step 2: Show Scanning Animation when Connected */}
            {walletConnected && isConnecting && (
              <div className="text-left">
                {walletTasks.map((task, index) => (
                  <AnimatedCheckmark
                    key={index}
                    text={task}
                    completed={taskStatus[index]}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Step 3: Show Score After Scan */}
            {completedScan && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-6"
              >
                <ScoreDisplay score={score} label="Points Earned" variant="secondary" />
              </motion.div>
            )}
          </GlassmorphicCard>

          {/* Connector line animation */}
          {completedScan && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 40, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-0.5 h-10 bg-gradient-to-b from-cyber-pink to-transparent mb-4"
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default WalletConnectPage;
