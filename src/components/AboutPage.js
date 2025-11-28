import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Award, Users, Video, Zap, Target, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: Video, number: '7+', label: 'سنوات خبرة', color: 'from-blue-500 to-cyan-500' },
    { icon: Sparkles, number: '33+', label: 'فيديو AI احترافي', color: 'from-purple-500 to-pink-500' },
    { icon: Users, number: '50+', label: 'عميل سعيد', color: 'from-orange-500 to-red-500' },
    { icon: Award, number: '100+', label: 'مشروع منجز', color: 'from-green-500 to-emerald-500' }
  ];

  const skills = [
    { icon: Camera, title: 'المونتاج الاحترافي', desc: 'خبرة عميقة في المونتاج والسرد السينمائي', color: 'bg-blue-500' },
    { icon: Sparkles, title: 'تصحيح الألوان', desc: 'إضافة المؤثرات البصرية والتحسينات', color: 'bg-purple-500' },
    { icon: Zap, title: 'فيديوهات الذكاء الاصطناعي', desc: 'إنتاج محتوى مبتكر بتقنيات AI متقدمة', color: 'bg-pink-500' }
  ];

  const experience = [
    { title: 'السياحة', desc: 'محتوى ترويجي جذاب', icon: '✈️' },
    { title: 'العقارات', desc: 'عروض عقارية احترافية', icon: '🏢' },
    { title: 'الأثاث المكتبي', desc: 'فيديوهات تسويقية مبتكرة', icon: '🪑' },
    { title: 'الأسواق الخليجية', desc: 'السعودية والإمارات', icon: '🌍' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center mb-16">
            {/* Profile Image */}
            <div className="relative inline-block mb-8">
              <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <div className="text-6xl">🎬</div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 rounded-full text-sm font-bold">
                AI Specialist
              </div>
            </div>

            {/* Name & Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Nouh ElKady
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-6">
              Video Editor & AI Specialist
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-300 text-sm">
                7+ سنوات خبرة
              </span>
              <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm">
                33+ فيديو AI
              </span>
              <span className="px-4 py-2 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-300 text-sm">
                محترف معتمد
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                  <div className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              من أنا؟
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/10 mb-16">
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed text-center mb-8">
              أنا محرر فيديو محترف بخبرة تزيد عن <span className="text-blue-400 font-bold">7 سنوات</span> في صناعة محتوى بصري مؤثر وجذاب. خلال مسيرتي، عملت مع شركات رائدة في مجالات السياحة، العقارات، والأثاث المكتبي، بالإضافة إلى التعاون مع عملاء في الأسواق السعودية والإماراتية.
            </p>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed text-center mb-8">
              بجانب المونتاج التقليدي، أنا متخصص في <span className="text-purple-400 font-bold">إنتاج فيديوهات بالذكاء الاصطناعي</span>، حيث أقدّم حلول إبداعية متطورة تجذب الجمهور.
            </p>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <p className="text-lg text-gray-200">
                أنجزت بنجاح أكثر من <span className="text-pink-400 font-bold text-2xl">33 فيديو احترافي</span> بالذكاء الاصطناعي لصالح علامات تجارية وشركات كبرى في دول عربية، مما ساعدها على رفع مستوى التسويق ورواية قصصها بشكل مبتكر.
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              المهارات والخبرات
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:-translate-y-2"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${skill.color} rounded-t-2xl`}></div>
                  <skill.icon className="w-12 h-12 mb-4 text-white group-hover:scale-110 transition-transform duration-300" />
                  <h4 className="text-xl font-bold mb-3 text-white">{skill.title}</h4>
                  <p className="text-gray-400">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              مجالات العمل
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105 text-center"
                >
                  <div className="text-4xl mb-3">{exp.icon}</div>
                  <h4 className="text-lg font-bold mb-2 text-white">{exp.title}</h4>
                  <p className="text-sm text-gray-400">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <TrendingUp className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              جاهز لإنشاء محتوى مميز؟
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              دعني أساعدك في تحويل أفكارك إلى فيديوهات احترافية تجذب الجمهور وتحقق أهدافك التسويقية
            </p>
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
              <span className="relative z-10">تواصل معي الآن</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}