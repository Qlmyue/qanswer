import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"

// Layout
import { AppLayout } from "@/components/layout/AppLayout"

// Auth pages
import { LoginView } from "@/views/auth/LoginView"
import { RegisterView } from "@/views/auth/RegisterView"

// Dashboard
import { DashboardView } from "@/views/dashboard/DashboardView"

// Review pages
import { ReviewListView } from "@/views/review/ReviewListView"
import { ReviewCreateView } from "@/views/review/ReviewCreateView"
import { ReviewDetailView } from "@/views/review/ReviewDetailView"
import { ReviewEditView } from "@/views/review/ReviewEditView"

// Challenge
import { ChallengeView } from "@/views/challenge/ChallengeView"

// Practice
import { PracticeView } from "@/views/practice/PracticeView"

// Analysis
import { AnalysisView } from "@/views/analysis/AnalysisView"

// Skill
import { SkillView } from "@/views/skill/SkillView"

// Export
import { ExportView } from "@/views/export/ExportView"

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout>{children}</AppLayout>
}

// Public route wrapper (redirect to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginView />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterView />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <ReviewListView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/create"
          element={
            <ProtectedRoute>
              <ReviewCreateView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:id"
          element={
            <ProtectedRoute>
              <ReviewDetailView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:id/edit"
          element={
            <ProtectedRoute>
              <ReviewEditView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenge"
          element={
            <ProtectedRoute>
              <ChallengeView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <PracticeView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <AnalysisView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <SkillView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/export"
          element={
            <ProtectedRoute>
              <ExportView />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
