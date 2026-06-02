'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getOrCreateDeviceId, storeInviteCode, storeNickname } from '@/lib/device';
import { useUserStore } from '@/stores/user-store';
import { Sparkles, MessageSquare } from 'lucide-react';

export function InviteForm() {
  const [inviteCode, setInviteCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setInviteCode: storeCode, setNickname: storeName } = useUserStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!inviteCode.trim()) {
      toast.error('请输入邀请码');
      return;
    }

    setLoading(true);

    try {
      const deviceId = await getOrCreateDeviceId();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/invite/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: inviteCode.trim(), deviceId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: '邀请码验证失败' }));
        toast.error(err.detail || '邀请码无效或已达设备上限');
        setLoading(false);
        return;
      }

      storeInviteCode(inviteCode.trim());
      storeCode(inviteCode.trim());

      if (nickname.trim()) {
        storeNickname(nickname.trim());
        storeName(nickname.trim());
      }

      if (feedback.trim()) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Device-Id': deviceId },
          body: JSON.stringify({ content: feedback.trim(), inviteCode: inviteCode.trim(), page: 'landing' }),
        }).catch(() => {});
      }

      toast.success('欢迎使用课研智造');
      router.push('/coursewares');
    } catch {
      toast.error('网络异常，请检查连接后重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
      <div className="flex gap-2.5">
        <Input
          placeholder="邀请码（必填）"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="flex-1 h-12 bg-white/80 dark:bg-card/80 backdrop-blur border-border/80 focus-visible:ring-brand-500 rounded-xl"
          maxLength={32}
          autoComplete="off"
          required
        />
        <Input
          placeholder="昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-28 h-12 bg-white/80 dark:bg-card/80 backdrop-blur border-border/80 focus-visible:ring-brand-500 rounded-xl"
          maxLength={16}
          autoComplete="off"
        />
      </div>

      {showFeedback && (
        <div className="animate-fade-in-up">
          <Textarea
            placeholder="有什么想法或建议？尽管告诉我们..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[84px] bg-white/80 dark:bg-card/80 backdrop-blur border-border/80 resize-none rounded-xl"
            maxLength={500}
          />
        </div>
      )}

      <div className="flex gap-2.5">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 h-12 bg-brand-600 hover:bg-brand-700 text-white rounded-xl gap-2 font-medium pressable"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? '验证中…' : '开始使用'}
        </Button>

        {!showFeedback && (
          <Button
            type="button"
            variant="outline"
            className="h-12 border-border/80 hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-xl gap-1.5 pressable"
            onClick={() => setShowFeedback(true)}
          >
            <MessageSquare className="h-4 w-4" />
            反馈
          </Button>
        )}
      </div>
    </form>
  );
}
