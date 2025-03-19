
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  BarChart3, 
  Rocket, 
  Gem, 
  Twitter, 
  MessageCircle, 
  Wallet, 
  Award,
  Zap,
  Flame,
  Medal,
  Crown
} from 'lucide-react';
import GlassmorphicCard from '@/components/GlassmorphicCard';
import CyberButton from '@/components/CyberButton';
import PageTransition from '@/components/PageTransition';
import ScoreDisplay from '@/components/ScoreDisplay';
import CircularGauge from '@/components/CircularGauge';
import Badge from '@/components/Badge';
import ShareButton from '@/components/ShareButton';
import ClusterLogo from '@/components/ClusterLogo';
import AchievementBadge from '@/components/AchievementBadge';
import { useScore } from '@/context/ScoreContext';

const leaderboardData = [
  { name: 'CryptoWhale', score: 980, rank: 1 },
  { name: 'DegenKing', score: 965, rank: 2 },
  { name: 'AlphaSeeker', score: 943, rank: 3 },
  { name: 'SatoshiLover', score: 932, rank: 4 },
  { name: 'TokenMaster', score: 929, rank: 5 },
];

const getBadgeText = (score: number) => {
  if (score > 900) return "Alpha Finder";
  if (score > 800) return "Degen Master";
  if (score > 700) return "Crypto Insider";
  if (score > 600) return "Web3 Enthusiast";
  if (score > 500) return "Future Whale";
  if (score > 400) return "Diamond Hands";
  if (score > 300) return "Hodler";
  if (score > 200) return "Crypto Explorer";
  return "Crypto Curious";
};

const ScorecardPage = () => {
  const navigate = useNavigate();
  const { scores, walletConnected } = useScore();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  
  useEffect(() => {
    if (!walletConnected) {
      navigate('/connect/wallet');
      return;
    }
    
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);
    
    const leaderboardTimer = setTimeout(() => {
      setShowLeaderboard(true);
    }, 2500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(leaderboardTimer);
    };
  }, [walletConnected, navigate]);
  
  useEffect(() => {
    const achievementTimer = setTimeout(() => {
      setShowAchievements(true);
    }, 3000);
    
    return () => clearTimeout(achievementTimer);
  }, []);
  
  const getAchievements = () => {
    return [
      { 
        icon: <Flame />, 
        label: "Early Adopter", 
        unlocked: scores.twitter > 1000, 
        color: "pink" as const
      },
      { 
        icon: <Trophy />, 
        label: "Top 10%", 
        unlocked: scores.percentile >= 90,
        color: "yellow" as const
      },
      { 
        icon: <Zap />, 
        label: "Power User", 
        unlocked: scores.total > 800,
        color: "blue" as const
      },
      { 
        icon: <Gem />, 
        label: "Gem Finder", 
        unlocked: scores.wallet > 3000,
        color: "green" as const
      },
    ];
  };
  
  const handleShare = () => {
    console.log('Sharing scorecard...');
  };
  
  return (
    <PageTransition>
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-8">
        <div className="absolute inset-0 overflow-hidden bg-black">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyber-green/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 w-full max-w-5xl px-4 mb-4">
          <ClusterLogo size="lg" />
        </div>
        
        <div id="scorecard-capture" className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-2 px-3 py-1 rounded-full bg-cyber-green/10 border border-cyber-green/30"
          >
            <span className="text-xs text-cyber-green cyber-glow">YOUR DEGEN STATUS</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-5xl font-bold mb-4 cyber-glow text-white"
          >
            {animationComplete ? getBadgeText(scores.total) : "Calculating..."}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-white/60 mb-8 max-w-xl"
          >
            Building the future of DeFi, one transaction at a time
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full mb-8">
            <div className="md:col-span-7">
              <GlassmorphicCard className="h-full flex flex-col relative overflow-hidden">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col items-center justify-center flex-1 relative z-10"
                >
                  <div className="flex flex-col items-center mb-4">
                    <CircularGauge 
                      value={animationComplete ? scores.total : 0}
                      maxValue={1000}
                      label={animationComplete ? `Top ${scores.percentile}% of Degens` : "Loading..."}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6 w-full">
                    <ScoreDisplay 
                      score={animationComplete ? scores.twitter : 0} 
                      label="Twitter"
                      variant="primary"
                      size="sm"
                    />
                    <ScoreDisplay 
                      score={animationComplete ? scores.telegram : 0} 
                      label="Telegram"
                      variant="accent"
                      size="sm"
                    />
                    <ScoreDisplay 
                      score={animationComplete ? scores.wallet : 0} 
                      label="Wallet"
                      variant="secondary"
                      size="sm"
                    />
                  </div>
                  
                  {animationComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className={`mb-4 px-4 py-2 rounded-full ${
                        scores.percentile > 90 
                          ? 'bg-cyber-yellow/10 border border-cyber-yellow/30 text-cyber-yellow' 
                          : scores.percentile > 70 
                          ? 'bg-cyber-green/10 border border-cyber-green/30 text-cyber-green'
                          : 'bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {scores.percentile > 90 ? 
                          <Crown size={16} /> : 
                          scores.percentile > 70 ? 
                          <Medal size={16} /> : 
                          <Award size={16} />
                        }
                        <span className="text-sm font-bold">{
                          scores.percentile > 90 
                            ? 'ELITE STATUS' 
                            : scores.percentile > 70 
                            ? 'ADVANCED STATUS' 
                            : 'RISING STAR'
                        }</span>
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showAchievements ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-2 w-full"
                  >
                    <h3 className="text-sm uppercase tracking-wider text-white/60 mb-3">Your Achievements</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {getAchievements().map((achievement, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 3.2 + (index * 0.1) }}
                        >
                          <AchievementBadge
                            icon={achievement.icon}
                            label={achievement.label}
                            color={achievement.color}
                            unlocked={achievement.unlocked}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </GlassmorphicCard>
            </div>
            
            <div className="md:col-span-5">
              <div className="space-y-4">
                <GlassmorphicCard>
                  <h3 className="text-xl font-semibold mb-4 text-white">Achievements</h3>
                  
                  <div className="space-y-3">
                    {animationComplete && (
                      <>
                        <Badge 
                          icon={<Trophy />} 
                          label="Rank" 
                          value={`#${scores.rank}`} 
                          color="yellow"
                        />
                        <Badge 
                          icon={<Twitter />} 
                          label="Twitter Influence" 
                          value={`${Math.round((scores.twitter / 4200) * 100)}%`} 
                          color="blue"
                        />
                        <Badge 
                          icon={<MessageCircle />} 
                          label="Telegram Activity" 
                          value={`${Math.round((scores.telegram / 5250) * 100)}%`} 
                          color="green"
                        />
                        <Badge 
                          icon={<Wallet />} 
                          label="Wallet Score" 
                          value={`${Math.round((scores.wallet / 6750) * 100)}%`} 
                          color="pink"
                        />
                      </>
                    )}
                  </div>
                </GlassmorphicCard>
                
                <GlassmorphicCard>
                  <h3 className="text-xl font-semibold mb-3 text-white">Top Degens</h3>
                  
                  <div className="space-y-2">
                    {leaderboardData.slice(0, 3).map((user, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={showLeaderboard ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className={`
                            w-7 h-7 rounded-full flex items-center justify-center mr-3
                            ${index === 0 ? 'bg-cyber-yellow/20 text-cyber-yellow border border-cyber-yellow/30' : 
                              index === 1 ? 'bg-white/20 text-white border border-white/30' : 
                              'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30'}
                          `}>
                            {index === 0 ? <Crown size={14} /> : index + 1}
                          </div>
                          <span className="text-white">{user.name}</span>
                        </div>
                        <span className="font-mono text-cyber-green">{user.score}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {animationComplete && scores.rank && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="flex items-center justify-between p-2 bg-cyber-green/10 rounded border border-cyber-green/30 animate-pulse">
                        <div className="flex items-center">
                          <div className="w-7 h-7 rounded-full bg-cyber-green/20 flex items-center justify-center mr-3 text-cyber-green border border-cyber-green/30">
                            {scores.rank}
                          </div>
                          <span className="text-white">You</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-mono text-cyber-green mr-2">{scores.total}</span>
                          <Zap size={16} className="text-cyber-green" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </GlassmorphicCard>
                
                <GlassmorphicCard>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">Next Challenge</h3>
                    <span className="text-xs px-2 py-1 bg-cyber-pink/10 text-cyber-pink rounded-full border border-cyber-pink/30">+500 POINTS</span>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Rocket className="text-cyber-pink" />
                      <p className="text-white font-medium">Join 5 more alpha channels</p>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyber-pink h-full" style={{ width: '40%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-white/60">
                      <span>2/5 completed</span>
                      <span>40%</span>
                    </div>
                  </motion.div>
                </GlassmorphicCard>
              </div>
            </div>
          </div>
          
          <div className="w-full flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5 }}
              className="mb-6"
            >
              <div className="flex flex-col items-center gap-3">
                <p className="text-white/80 mb-2">Share your score with friends!</p>
                <ShareButton onShare={handleShare} />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="px-4 py-1 rounded-full bg-cyber-green/5 border border-cyber-green/20">
                <p className="text-xs text-white/60">
                  <span className="text-cyber-green">837</span> people shared their score today
                </p>
              </div>
              <div className="text-xs text-white/40">
                Powered by Cluster Protocol • The Ultimate Degen Scoring Platform
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ScorecardPage;
