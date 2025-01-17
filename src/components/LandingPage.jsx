import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Heart, TrendingUp, Volume2, Brain, Users, MessageSquare, Sun, Moon } from 'lucide-react';
import Demo from './Demo'
import { useNavigate } from 'react-router-dom';
// Import dotenv config
import dotenv from 'dotenv';




export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Intersection Observer setup
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.add('opacity-100');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all animated sections
    document.querySelectorAll('.animate-on-scroll').forEach((section) => {
      section.classList.add('opacity-0');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email)
    // Send form data to Google Apps Script endpoint
    fetch(`${import.meta.env.VITE_BACKEND_URL}user/emaillist/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    }).then(() => {
      setSubmitted(true);
      setName('');
      setEmail('');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };


  const showDemo = () => {
    console.log('Demo button clicked');
    navigate('/demo');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode class to document body to enable global theme switching
    document.body.classList.toggle('dark-mode');
  };

  const trainerPersonalities = [
    {
      name: "The Motivator",
      description: "High-energy, passionate, and always ready to push you beyond your limits. Perfect for those who thrive on enthusiasm and positive reinforcement.",
      style: "from-orange-400 to-pink-600",
      icon: "🔥",
      image: "/imgs/bald_trainer.png"
    },
    {
      name: "The Analyst", 
      description: "Data-driven, methodical, and focused on perfect form. Ideal for detail-oriented individuals who love tracking progress and understanding the science.",
      style: "from-blue-400 to-cyan-600",
      icon: "📊",
      image: "/imgs/ponytail_trainer.png"
    },
    {
      name: "The Nurturer",
      description: "Gentle, patient, and understanding. Great for beginners or those who prefer a more supportive and encouraging approach to fitness.",
      style: "from-green-400 to-emerald-600", 
      icon: "🌱",
      image: "/imgs/yoga_instructor.png"
    },
    {
      name: "The Challenger",
      description: "Direct, no-excuses attitude that keeps you accountable. Perfect for those who need firm guidance and thrive under pressure.",
      style: "from-purple-400 to-indigo-600",
      icon: "⚡",
      image: "/imgs/drill_sargeant.png"
    }
  ];
  const renderTrainerCard = (trainer, index) => (
    <div 
      key={trainer.name} 
      className={`animate-on-scroll relative h-96 w-full [perspective:1000px] group cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
    >
      <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front of card */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className={`h-full ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'} rounded-xl p-6 backdrop-blur`}>
            <div className="text-4xl mb-4">{trainer.icon}</div>
            <h3 className={`text-xl font-semibold mb-3 bg-gradient-to-r ${trainer.style} text-transparent bg-clip-text`}>
              {trainer.name}
            </h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{trainer.description}</p>
          </div>
        </div>
        {/* Back of card */}
        <div className="absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className={`h-full ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/90'} rounded-xl overflow-hidden`}>
            <div className="relative h-full">
              <img 
                src={trainer.image} 
                alt={trainer.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <div className="w-full">
                  <h3 className={`text-xl font-semibold bg-gradient-to-r ${trainer.style} text-transparent bg-clip-text will-change-transform`}>
                    {trainer.name}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-900'}`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      {/* Rest of the components - update background and text colors based on theme */}
      {/* Hero Section */}
      <div className="relative min-h-[100vh] flex flex-col justify-between">
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-purple-900/20 to-black' : 'bg-gradient-to-br from-purple-100 to-white'} pointer-events-none`}></div>
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-black/40' : 'bg-white/40'} sm:bg-transparent pointer-events-none`}></div>

        

        <div className="container mx-auto px-4 relative z-10 pt-4 flex items-center justify-center min-h-screen">
        <div className={`max-w-4xl mx-auto text-center ${isDarkMode ? 'bg-black/30' : 'bg-white/30'}`}>
          
            {/* <div className={`${isDarkMode ? 'bg-gray-900/80' : 'bg-gray-100/80'} backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} mb-8`}> */}
              {/* <h2 className="text-3xl sm:text-4xl font-bold mb-6">Try Demo</h2>   */}
             
            {/* </div> */}
            <div className={`${isDarkMode ? 'bg-gray-900/80' : 'bg-gray-100/80'} backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Joint Waitlist</h2>  
              <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
                {!submitted ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-white">
                      Join Waitlist
                      <ArrowRight size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="text-green-400 text-lg sm:text-xl animate-fade-in">
                    Thanks! We'll notify you when we launch.
                  </div>
                )}
              </form>

              <button 
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 mb-8 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-white"
                onClick={showDemo}
              >
                Try Demo
              </button>
            </div>
            
          </div>
        </div>

        <div className="absolute bottom-0 w-full px-4">
          <div className="max-w-5xl mx-auto">
            <img
              src="/imgs/yoga_living_room.png"
              alt="Smart TV Interface Preview"
              className={`rounded-t-xl sm:rounded-t-3xl shadow-2xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} w-full`}
            />
          </div>
        </div>
      </div>

      {/* Voice Interface Section */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-20`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left animate-on-scroll">
              <div className="inline-flex items-center gap-2 bg-blue-600/20 px-4 py-2 rounded-full mb-6">
                <Volume2 size={16} className="text-blue-400" />
                <span className="text-sm text-blue-400">Voice Activated</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Just Talk</h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                No more fumbling with remotes or apps. Simply tell your AI coach what you want to do, 
                and it will guide you through your workout with natural conversation.
              </p>
            </div>
            <div className="flex-1 animate-on-scroll" style={{ animationDelay: '200ms' }}>
              <img
                src="/imgs/talking_to_trainer.png"
                alt="Voice Interface Demo"
                className={`rounded-xl shadow-2xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} w-full transform transition-transform hover:scale-105 duration-500`}
              />
            </div>
          </div>
        </div>
      </div>
      
     {/* Trainer Personality Section */}
     <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-20`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-full mb-6">
              <Users size={16} className="text-purple-400" />
              <span className="text-sm text-purple-400">Personality Match</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Choose Your Perfect AI Trainer</h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Select from different trainer personalities or let our AI adapt to match your unique style. 
              Your trainer learns and evolves through natural conversation to become your ideal fitness partner.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainerPersonalities.map((trainer, index) => renderTrainerCard(trainer, index))}
          </div>
        </div>
      </div>

      {/* Psychological Adaptation Section */}
      <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} py-20`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 animate-on-scroll">
              <img
                src="/imgs/reflection_ai.png"
                alt="AI Conversation Interface"
                className={`rounded-xl shadow-2xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} w-full transform transition-transform hover:scale-105 duration-500`}
              />
            </div>
            <div className="flex-1 text-center md:text-left animate-on-scroll" style={{ animationDelay: '200ms' }}>
              <div className="inline-flex items-center gap-2 bg-rose-600/20 px-4 py-2 rounded-full mb-6">
                <MessageSquare size={16} className="text-rose-400" />
                <span className="text-sm text-rose-400">Smart Adaptation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Your Trainer Understands You</h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Through daily conversations and interactions, your AI trainer learns your:
              </p>
              <ul className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} space-y-4 text-left list-none`}>
                {[
                  "Motivation triggers and what drives you to succeed",
                  "Communication style preferences and how you best receive feedback",
                  "Stress patterns and emotional responses to challenges",
                  "Schedule preferences and optimal workout timing"
                ].map((item, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-3 animate-on-scroll"
                    style={{ animationDelay: `${index * 100 + 400}ms` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-rose-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-rose-400 text-sm">{index + 1}</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracking Section */}
      <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} py-20`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left animate-on-scroll" style={{ animationDelay: '200ms' }}>
              <div className="inline-flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-full mb-6">
                <TrendingUp size={16} className="text-purple-400" />
                <span className="text-sm text-purple-400">Track Progress</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Watch Your Progress Grow</h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Advanced metrics track your muscle gain, strength improvements, and overall fitness journey. 
                See your progress visualized in real-time and stay motivated with achievable goals.
              </p>
            </div>
            <div className="flex-1 animate-on-scroll">
              <img
                src="/imgs/progress_dashboard.png"
                alt="Progress Tracking Dashboard"
                className={`rounded-xl shadow-2xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} w-full transform transition-transform hover:scale-105 duration-500`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Companion Section */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-20`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left animate-on-scroll" style={{ animationDelay: '200ms' }}>
              <div className="inline-flex items-center gap-2 bg-pink-600/20 px-4 py-2 rounded-full mb-6">
                <Brain size={16} className="text-pink-400" />
                <span className="text-sm text-pink-400">AI Companion</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Your Personal Motivation Partner</h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Meet your AI companion that learns your preferences, celebrates your wins, 
                and keeps you accountable. It's like having a supportive friend who's always there 
                to push you towards your goals.
              </p>
            </div>
            <div className="flex-1 animate-on-scroll">
              <img
                src="/imgs/high_five.png"
                alt="AI Companion Interface"
                className={`rounded-xl shadow-2xl border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} w-full transform transition-transform hover:scale-105 duration-500`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} py-20`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 animate-on-scroll">Transform Your Life</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-xl p-6 sm:p-8 animate-on-scroll`} style={{ animationDelay: '200ms' }}>
              <img
                src="/imgs/wedding_dress.png"
                alt="Wedding Preparation"
                className="rounded-lg mb-6 w-full"
              />
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Wedding Ready</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Looking your best for your special day? Our AI coach creates a personalized plan 
                to help you achieve your wedding fitness goals with plenty of time to spare.
              </p>
            </div>
            
            <div className={`${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-xl p-6 sm:p-8 animate-on-scroll`} style={{ animationDelay: '400ms' }}>
              <img
                src="/imgs/post_partum.png"
                alt="Pregnancy Fitness"
                className="rounded-lg mb-6 w-full"
              />
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">Pre & Post Pregnancy</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Safe workouts adapted for each trimester and postpartum recovery. 
                Stay healthy and strong throughout your pregnancy journey.
              </p>
            </div>

            <div className={`${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100'} rounded-xl p-6 sm:p-8 md:col-span-2 animate-on-scroll`} style={{ animationDelay: '600ms' }}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:flex-1">
                  <div className="inline-flex items-center gap-2 bg-green-600/20 px-4 py-2 rounded-full mb-6">
                    <Heart size={16} className="text-green-400" />
                    <span className="text-sm text-green-400">Health Benefits</span>
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Prevention Through Exercise</h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg mb-6`}>
                    Regular exercise helps prevent:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'} rounded-lg p-4 flex items-center gap-3 transition-colors duration-300 hover:bg-red-400 group`}>
                      <Heart className="w-6 h-6 text-red-400 group-hover:text-white" />
                      <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-white`}>Heart disease and stroke</span>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'} rounded-lg p-4 flex items-center gap-3 transition-colors duration-300 hover:bg-blue-400 group`}>
                      <TrendingUp className="w-6 h-6 text-blue-400 group-hover:text-white" />
                      <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-white`}>Type 2 diabetes</span>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'} rounded-lg p-4 flex items-center gap-3 transition-colors duration-300 hover:bg-purple-400 group`}>
                      <Brain className="w-6 h-6 text-purple-400 group-hover:text-white" />
                      <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-white`}>Several types of cancer</span>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'} rounded-lg p-4 flex items-center gap-3 transition-colors duration-300 hover:bg-green-400 group`}>
                      <Users className="w-6 h-6 text-green-400 group-hover:text-white" />
                      <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-white`}>Osteoporosis</span>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'} rounded-lg p-4 flex items-center gap-3 transition-colors duration-300 hover:bg-yellow-400 group`}>
                      <MessageSquare className="w-6 h-6 text-yellow-400 group-hover:text-white" />
                      <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-white`}>Depression and anxiety</span>
                    </div>
                    <div className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-200'} rounded-lg p-4 flex items-center gap-3 transition-colors duration-300 hover:bg-orange-400 group`}>
                      <Brain className="w-6 h-6 text-orange-400 group-hover:text-white" />
                      <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'} group-hover:text-white`}>Cognitive decline and dementia</span>
                    </div>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-lg mt-8 mb-4`}>
                    Our AI coach helps you maintain a consistent routine to maximize your health.
                  </p>
                </div>
                <div className="md:flex-1">
                  <img
                    src="/imgs/waiting_medical.png"
                    alt="Health Benefits"
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`bg-gradient-to-b ${isDarkMode ? 'from-gray-900 to-black' : 'from-gray-100 to-white'} py-20`}>
        <div className="container mx-auto px-4 text-center animate-on-scroll">
          <div className={`inline-flex items-center gap-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'} px-4 py-2 rounded-full mb-6`}>
            <Play size={16} className="text-blue-400" />
            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Coming Soon</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Start Your Fitness Journey Today
          </h2>
          <p className={`text-lg sm:text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
            Join thousands of others transforming their lives with the power of AI-guided fitness.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            {!submitted ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900'} border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <button className="px-8 py-4 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2 hover:transform hover:scale-105 text-white">
                  Join Waitlist
                  <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              <div className="text-green-400 text-lg sm:text-xl animate-fade-in">
                Thanks! We'll notify you when we launch.
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-title {
          animation: fadeInUp 1s ease-out forwards;
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
}
