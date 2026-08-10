import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Dashboard from './pages/Dashboard';
import AssessmentForm from './components/assessment/AssessmentForm';
import ReportDetail from './pages/ReportDetail';
import SimulatorPage from './pages/SimulatorPage';
import HistoryPage from './pages/HistoryPage';
import ComparePage from './pages/ComparePage';
import GoalsPage from './pages/GoalsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RoiCalculatorPage from './pages/RoiCalculatorPage';
import LeaderboardPage from './pages/LeaderboardPage';
import AiAdvisorPage from './pages/AiAdvisorPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AiAdvisorFloatingChat from './components/common/AiAdvisorFloatingChat';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createAssessment } from './services/api';

function MainContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [selectedSimData, setSelectedSimData] = useState(null);

  // Floating AI Chatbot State
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const handleAssessmentCreated = async (formData) => {
    const saved = await createAssessment(formData);
    setSelectedAssessmentId(saved._id);
    setActiveTab('report');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans relative">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'ai-advisor') {
            setIsAiChatOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            setSelectedAssessmentId={setSelectedAssessmentId}
            setSelectedSimData={setSelectedSimData}
            onOpenAiModal={() => setIsAiChatOpen(true)}
          />
        )}

        {activeTab === 'new-assessment' && (
          <div className="max-w-4xl mx-auto">
            <AssessmentForm onSubmitSuccess={handleAssessmentCreated} />
          </div>
        )}

        {activeTab === 'report' && (
          <ReportDetail
            assessmentId={selectedAssessmentId}
            setActiveTab={setActiveTab}
            setSelectedSimData={setSelectedSimData}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorPage
            initialData={selectedSimData}
            setActiveTab={setActiveTab}
            setSelectedAssessmentId={setSelectedAssessmentId}
          />
        )}

        {activeTab === 'roi-calculator' && (
          <RoiCalculatorPage />
        )}

        {activeTab === 'compare' && (
          <ComparePage
            setActiveTab={setActiveTab}
            setSelectedAssessmentId={setSelectedAssessmentId}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardPage />
        )}

        {activeTab === 'goals' && (
          <GoalsPage />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage />
        )}

        {activeTab === 'ai-advisor' && (
          <AiAdvisorPage
            setActiveTab={setActiveTab}
            setSelectedSimData={setSelectedSimData}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            setActiveTab={setActiveTab}
            setSelectedAssessmentId={setSelectedAssessmentId}
            setSelectedSimData={setSelectedSimData}
          />
        )}

        {activeTab === 'login' && (
          <LoginPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'register' && (
          <RegisterPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'profile' && (
          <ProfilePage setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Persistent Floating AI Chatbot (Lower-Right Corner) */}
      <AiAdvisorFloatingChat
        isOpen={isAiChatOpen}
        setIsOpen={setIsAiChatOpen}
        setActiveTab={setActiveTab}
        setSelectedSimData={setSelectedSimData}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
