export function Disclaimer() {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 mx-3 mb-3 rounded-xl bg-[var(--copper-50)]/80 dark:bg-[var(--copper-950)]/30 border border-[var(--copper-200)]/60 dark:border-[var(--copper-800)]/40 text-xs text-[var(--copper-800)] dark:text-[var(--copper-300)] leading-relaxed">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="mt-0.5 shrink-0 opacity-60" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 1.5C4.187 1.5 1.5 4.187 1.5 7.5s2.687 6 6 6 6-2.687 6-6-2.687-6-6-6zm0 9a.75.75 0 100-1.5.75.75 0 000 1.5zm.75-3.75v5.5h-1.5v-5.5h1.5z" fill="currentColor"/>
      </svg>
      <p>
        <strong className="font-medium">免责声明：</strong>
        本平台内容由 AI 生成，仅供教学参考。建议教师因材施教，根据学生实际情况修改课件内容，确保教学准确性与适用性。
      </p>
    </div>
  );
}
