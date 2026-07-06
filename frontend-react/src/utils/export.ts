import type { ReviewPoint } from "@/types"

export function exportReviewPoint(reviewPoint: ReviewPoint): void {
  const content = generateMarkdown(reviewPoint)
  downloadFile(content, `${reviewPoint.question.substring(0, 50)}.md`)
}

export function exportMultipleReviewPoints(reviewPoints: ReviewPoint[]): void {
  reviewPoints.forEach((rp) => {
    const content = generateMarkdown(rp)
    downloadFile(content, `${rp.question.substring(0, 50)}.md`)
  })
}

function generateMarkdown(reviewPoint: ReviewPoint): string {
  let md = `# ${reviewPoint.question}\n\n`

  md += `## 答案\n\n${reviewPoint.answer}\n\n`

  if (reviewPoint.referenceLinks.length > 0) {
    md += `## 参考资料\n\n`
    reviewPoint.referenceLinks.forEach((link, index) => {
      md += `${index + 1}. [${link}](${link})\n`
    })
    md += "\n"
  }

  if (reviewPoint.skillTags.length > 0) {
    md += `## 技能标签\n\n`
    md += reviewPoint.skillTags.map((tag) => `\`${tag}\``).join(" ") + "\n\n"
  }

  md += `---\n\n`
  md += `- 答案来源: ${reviewPoint.answerSource === "ai_generated" ? "AI生成" : "手动输入"}\n`
  md += `- 复盘状态: ${reviewPoint.isReviewed ? "已复盘" : "未复盘"}\n`
  md += `- 创建时间: ${new Date(reviewPoint.createdAt).toLocaleString("zh-CN")}\n`

  return md
}

function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
