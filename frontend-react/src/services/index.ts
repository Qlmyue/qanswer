/**
 * Service export index
 * Controls whether to use mock services or real API via USE_MOCK constant
 */

// Mock services
import { dashboardService as mockDashboardService } from "./mock/dashboard"
import { reviewService as mockReviewService } from "./mock/review"
import { challengeService as mockChallengeService } from "./mock/challenge"
import { practiceService as mockPracticeService } from "./mock/practice"
import { skillService as mockSkillService } from "./mock/skill"
import { reportService as mockReportService } from "./mock/report"

// Real API services
import { dashboardApi } from "./api/dashboard"
import { reviewApi } from "./api/review"
import { challengeApi } from "./api/challenge"
import { practiceApi } from "./api/practice"
import { skillApi } from "./api/skill"
import { reportApi } from "./api/report"

// Export services (based on configuration)
const USE_MOCK = false

export const dashboardService = USE_MOCK ? mockDashboardService : dashboardApi
export const reviewService = USE_MOCK ? mockReviewService : reviewApi
export const challengeService = USE_MOCK ? mockChallengeService : challengeApi
export const practiceService = USE_MOCK ? mockPracticeService : practiceApi
export const skillService = USE_MOCK ? mockSkillService : skillApi
export const reportService = USE_MOCK ? mockReportService : reportApi
