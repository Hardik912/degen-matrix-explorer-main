
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import CyberButton from '@/components/CyberButton';
import PageTransition from '@/components/PageTransition';
import AnimatedCheckmark from '@/components/AnimatedCheckmark';
import FloatingElements from '@/components/FloatingElements';
import ScoreDisplay from '@/components/ScoreDisplay';
import { useScore } from '@/context/ScoreContext';

const telegramTasks = [
  'Checking Group Memberships',
  'Analyzing Activity & Replies',
  'Measuring Influence in Key Groups',
  'Detecting Admin/Mod Roles'
];

const TelegramConnectPage = () => {
  const navigate = useNavigate();
  const { setTelegramScore, setTelegramConnected, twitterConnected } = useScore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [taskStatus, setTaskStatus] = useState<boolean[]>([false, false, false, false]);
  const [completedScan, setCompletedScan] = useState(false);
  const [score, setScore] = useState(0);
  const targetScore = 5250;
  
  useEffect(() => {
    // If Twitter is not connected, redirect back to Twitter
    if (!twitterConnected) {
      navigate('/connect/twitter');
    }
  }, [twitterConnected, navigate]);
  
  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate Telegram connection and scanning tasks
    let currentTask = 0;
    const taskInterval = setInterval(() => {
      if (currentTask < taskStatus.length) {
        setTaskStatus(prev => {
          const newStatus = [...prev];
          newStatus[currentTask] = true;
          return newStatus;
        });
        currentTask++;
      } else {
        clearInterval(taskInterval);
        setCompletedScan(true);
        
        // Start incrementing score
        let currentScore =  0;
        const scoreIncrement = Math.ceil(targetScore / 50);
        const scoreInterval = setInterval(() => {
          currentScore += scoreIncrement;
          if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(scoreInterval);
            
            // Wait a moment and then proceed to next page
            setTimeout(() => {
              setTelegramScore(targetScore);
              setTelegramConnected(true);
              navigate('/connect/wallet');
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
     <FloatingElements type="messages" count={20} />
        
        {/* Main content */}
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
                className={`w-12 h-1 rounded-full ${i <= 1 ? 'bg-cyber-green/70' : 'bg-white/20'}`}
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
              <div className="w-12 h-12 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center">
                <MessageSquare size={24} className="text-cyber-blue" />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2 text-white"
            >
              Connect Your Telegram
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/70 mb-6"
            >
              Your community engagement matters. Let's analyze it!
            </motion.p>
            
            {!isConnecting && (
              <CyberButton 
                onClick={handleConnect} 
                className="w-full"
                variant="secondary"
                icon={<MessageSquare size={18} />}
              >
                Connect Telegram
              </CyberButton>
            )}
            
            {isConnecting && (
              <div className="text-left">
                {telegramTasks.map((task, index) => (
                  <AnimatedCheckmark 
                    key={index} 
                    text={task} 
                    completed={taskStatus[index]} 
                    index={index} 
                  />
                ))}
              </div>
            )}
            
            {completedScan && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-6"
              >
                <ScoreDisplay score={score} label="Points Earned" variant="accent" />
              </motion.div>
            )}
          </GlassmorphicCard>
          
          {/* Connector line animation */}
          {completedScan && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 40, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="w-0.5 h-10 bg-gradient-to-b from-cyber-blue to-transparent mb-4"
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default TelegramConnectPage;
