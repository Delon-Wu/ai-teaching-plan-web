'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { apiUpload } from '@/lib/api';

interface Props {
  onOutlineReady: (outline: string) => void;
  onBack: () => void;
}

export function UploadForm({ onOutlineReady, onBack }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [requirements, setRequirements] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [outline, setOutline] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    const validTypes = ['.doc', '.docx', '.txt', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext) && !validTypes.includes(f.type)) {
      toast.error('仅支持 Word (.docx/.doc) 和 TXT 文件');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('文件大小不能超过 10MB');
      return;
    }
    setFile(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
  });

  async function handleExtract() {
    if (!file) return;
    setExtracting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await apiUpload<{ outline: string }>('/generate/outline', formData);
      setOutline(result.outline);
      toast.success('大纲提取成功！');
    } catch {
      toast.error('大纲提取失败，请重试');
    } finally {
      setExtracting(false);
    }
  }

  if (outline) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
          <h4 className="font-medium mb-2">AI 提取的大纲</h4>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">{outline}</pre>
        </div>
        <Textarea
          placeholder="补充要求（选填）..."
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="min-h-[80px]"
        />
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>上一步</Button>
          <Button
            className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
            onClick={() => onOutlineReady(outline + '\n\n补充要求：' + requirements)}
          >
            下一步：选择风格
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-brand-400'
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-brand-500" />
            <div className="text-left">
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div>
            <Upload className="h-10 w-10 mx-auto mb-3 text-slate-400" />
            <p className="text-sm text-slate-600 dark:text-slate-400">拖拽文件到此处，或点击选择</p>
            <p className="text-xs text-muted-foreground mt-1">支持 .docx .doc .txt，最大 10MB</p>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>上一步</Button>
        <Button
          onClick={handleExtract}
          disabled={!file || extracting}
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
        >
          {extracting ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              提取大纲中...
            </>
          ) : (
            '提取大纲'
          )}
        </Button>
      </div>
    </div>
  );
}
