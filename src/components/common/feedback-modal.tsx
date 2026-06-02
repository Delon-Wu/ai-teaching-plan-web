'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!content.trim()) {
      toast.error('请填写反馈内容');
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/feedback', {
        method: 'POST',
        body: {
          content: content.trim(),
          email: email.trim() || undefined,
          page: window.location.pathname,
        },
      });
      toast.success('感谢你的反馈');
      setContent('');
      setEmail('');
      setOpen(false);
    } catch {
      toast.error('提交失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-5 right-5 z-40 gap-1.5 shadow-lg rounded-xl border-border/60 bg-card/90 backdrop-blur pressable"
          />
        }
      >
        <MessageSquare className="h-4 w-4" />
        意见反馈
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">意见反馈</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Textarea
            placeholder="请描述你的意见或建议…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] rounded-xl resize-none"
            maxLength={1000}
          />
          <Input
            placeholder="邮箱（选填，方便我们回复）"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="rounded-xl"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium pressable"
          >
            {loading ? '提交中…' : '提交反馈'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
